import { Server as SocketIOServer, Socket } from "socket.io";
import { authSocket } from "../middlewares/authSocket.ts";
import { db } from "../index.ts";
export const setupSocketIO = (io: SocketIOServer) => {

 authSocket(io)

 io.on("connection", (socket) => {
  const user = socket.user;
  console.log("🟢 Connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });

  socket.on("leaveTrip" , (tripId) => {
    const roomName = `trip_${tripId}`
    console.log(`User left ${roomName}`);
    socket.leave(tripId)

  })

  socket.on("joinTrip", async (tripId) => {
    const roomName = `trip_${tripId}`;
    const id = tripId
    socket.join(roomName);
    console.log(`User ${socket.user.username} joined room : ${roomName}`);

      const messages = await db.message.findMany({
      where: { tripId : id },
      orderBy: { timestamp: 'asc' },
      include: { user: true },
      take: 50
    });
    
    socket.emit("chatHistory" , messages.map(m => ({
      message : m.content,
      timestamp : m.timestamp,
      user : {id : m.user.id , username: m.user.username , img: m.user.img}
    })))

    socket.to(roomName).emit("userJoined", {
      user,
      tripId,
      timestamp: Date.now(),
    });
  });

  socket.on("sendMessage", async ({ chatId , message }) => {
    if(message === ""){
      console.log("Message is empty");
      return
    }
    const roomName = `trip_${chatId}`;
    const user = socket.user;
    try{
      const id = user.id;
      const savedMessage = await db.message.create({
        data : {
          content : message,
          tripId : chatId,
          userId : id
        },
        include: {
          user: true
        }
      })
      io.to(roomName).emit("receiveMessage", {
        message,
        user,
        timestamp: Date.now(),
      });
    }
    catch(err){
      console.error('Error saving message:', err);
    }
  });
});

};
