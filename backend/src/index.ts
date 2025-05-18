import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "./generated/prisma/index.js";
import userRoute from "./routes/userRoute.ts";
import tripRoute from "./routes/tripRoute.ts";
import participantRoute from "./routes/participantRoute.ts";
import { createServer } from "http";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { setupSocketIO } from "./socket/index.ts";
// Utility to convert Node.js request stream into a ReadableStream
function nodeRequestToReadable(
  req: http.IncomingMessage
): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      req.on("data", (chunk) => controller.enqueue(new Uint8Array(chunk)));
      req.on("end", () => controller.close());
      req.on("error", (err) => controller.error(err));
    },
  });
}

const app = new Hono();
export const db = new PrismaClient();
app.use("*", async (c, next) => {
  // for cors settings
  // Set CORS headers manually for the response
  c.res.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
  c.res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE,PATCH"
  );
  c.res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  c.res.headers.set("Access-Control-Allow-Credentials", "true");

  // If the request method is OPTIONS, respond with 200 (preflight request)
  if (c.req.method === "OPTIONS") {
    return c.json({}, 200);
  }

  return next();
});
app.route("/participant", participantRoute);
app.route("/user", userRoute);
app.route("/trip", tripRoute);
app.get("/", (c) => {
  return c.text("Hello Hono!");
});
const handler = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const url = `http://${req.headers.host}${req.url}`;

  const request = new Request(url, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body:
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : nodeRequestToReadable(req),
    duplex: "half",
  } as RequestInit & { duplex: "half" }); // ✅ allows 'du)

  const response = await app.fetch(request);

  res.writeHead(
    response.status,
    Object.fromEntries(response.headers.entries())
  );
  res.end(await response.text());
};
const server = http.createServer(handler);
export const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // adjust as needed
  },
});
setupSocketIO(io);

server.listen(4002, () => {
  console.log(`🚀 Server running at http://localhost:${4002}`);
});
