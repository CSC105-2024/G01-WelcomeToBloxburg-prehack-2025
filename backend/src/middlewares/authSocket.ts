import { io } from "../index.ts";
import { Server, Socket } from "socket.io";
import { jwtVerify } from "jose";
declare module "socket.io" {
  interface Socket {
    user?: any; // or better: { id: string, name: string, avatar?: string }
  }
}

export const authSocket = async (io: Server) => {
  io.use(async (socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    const secret = new TextEncoder().encode(process.env.TOKEN_KEY);
    
      if (!token) {
    return next(new Error("No token provided"));
  }
    try {
      
      const { payload } = await jwtVerify(token, secret);
      
      socket.user = payload.user;

      next();
    } catch (err: any) {
      if (err.code === "ERR_JWT_EXPIRED") {
        console.log("Token expired.");
      } else {
        console.log("Invalid token:", err.message);
      }
      return next(new Error("Authentication error"));
    }
  });
};
