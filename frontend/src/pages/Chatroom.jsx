import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const socket = io("http://localhost:4002", {
  auth: {
    token: localStorage.getItem("token"),
  },
});
function Chatroom() {
  const { chatId } = useParams();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [notify, setNofity] = useState([]);
  const [chatroom, setChatroom] = useState(null);
  const [user, setUser] = useState(null);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);
  const sendMessage = () => {
    socket.emit("sendMessage", { chatId, message });
    setMessage("");
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [chat]);
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await axios.get(`http://localhost:4002/trip/${chatId}`);
        setChatroom(res.data.data);
      } catch (err) {
        console.err(err);
      }
    };
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:4002/user/api/profile`, {
          withCredentials: true,
        });
        setUser(res.data.user.user);
      } catch (err) {
        console.err(err);
      }
    };
    if (chatId) {
      socket.emit("joinTrip", chatId);
      socket.on("chatHistory", (data) => {
        console.log(data);

        setChat(data);
      });
      socket.on("userJoined", (data) => {
        console.log("User joined", data);

        setNofity((prev) => [...prev, data]);
      });
      socket.on("receiveMessage", (data) => {
        console.log("New message:", data);
        setChat((prev) => [...prev, data]);
      });
      fetchUser();
      fetchChat();
      // Cleanup on component unmount
      return () => {
        socket.emit("leaveTrip", chatId); // optional if you manage rooms
        socket.off("receiveMessage");
        socket.off("userJoined");
        socket.off("chatHistory");
      };
    }
    console.log(chatId);
  }, [chatId]);
  if (!chatroom || !user) return <>Loading....</>;
  return (
    <div className="flex mt-10 flex-col items-center ">
      <div className="relative w-full h-full flex flex-col items-center">
        <h1 className="text-2xl md:text-4xl">Chat room of {chatroom.tripName}</h1>
        <div
          className="mt-4  w-full  h-[75vh]  overflow-y-auto bg-gray-50 "
          ref={chatRef}
        >
          {chatroom &&
            user &&
            chat?.map((value, index) => {
              const dateObj = new Date(value.timestamp);
              const msgDate = format(dateObj, "yyyy-MM-dd");

              const prevMsg = chat[index - 1];
              const prevDate = prevMsg
                ? format(new Date(prevMsg.timestamp), "yyyy-MM-dd")
                : null;

              const isNewDay = msgDate !== prevDate;
              const time = format(dateObj, "p"); // like "10:12 PM"

              const date = dateObj.toLocaleDateString([], {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              return (
                <div key={index}>
                  {isNewDay && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border">
                        {format(dateObj, "MMMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex items-end px-4 ${
                      value.user.id == user.id ? " flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-full border-1 border-black"
                      style={{
                        backgroundImage: `url(${value.user.img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="mx-2">
                      <p
                        className={`text-sm flex ${
                          value.user.id == user.id ? "justify-end" : ""
                        }`}
                      >
                        {value.user.username}
                      </p>
                      <div
                        class={
                          value.user.id == user.id
                            ? "relative bg-myPrimary text-white px-4 py-2 rounded-lg shadow-md max-w-xs border-2 "
                            : "relative bg-white text-black px-4 py-2 rounded-lg shadow-md max-w-xs border-2 "
                        }
                      >
                        <p>{value.message}</p>

                        <div
                          class={
                            value.user.id == user.id
                              ? "absolute -right-2 bottom-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-blue-500"
                              : "absolute -left-2 bottom-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-200"
                          }
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray ml-2">
                      {format(value.timestamp, "p")}
                    </p>
                  </div>
                </div>
              );
            })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="absolute bottom-0 p-2  w-full flex"
      >
        <input
          type="text"
          className="p-2 pl-4 w-full rounded-full relative bg-white"
          placeholder="Say something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-myPrimary absolute right-7 flex top-4 "
          onClick={sendMessage}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chatroom;
