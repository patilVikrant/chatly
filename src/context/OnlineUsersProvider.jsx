import { useEffect, useState } from "react";
import { OnlineUsersContext } from "./OnlineUsersContext";
import { useSocket } from "./SocketContext";

export const OnlineUsersProvider = ({ children }) => {
  const socket = useSocket();
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    if (!socket) return;

    // initial list when a user connects
    socket.on("online_users", (users) => {
      console.log("online_users payload received:", users);
      setOnlineUsers(new Set(users));
    });

    // add newly connected user to this list
    socket.on("user_online", ({ userId }) => {
      setOnlineUsers((prevValue) => new Set(prevValue).add(userId));
    });

    // remove user from the list when disconnected
    socket.on("user_offline", ({ userId }) => {
      setOnlineUsers((prevValue) => {
        const updatedValue = new Set(prevValue);
        updatedValue.delete(userId);
        return updatedValue;
      });
    });

    // request online user list
    socket.emit("request_online_users");

    return () => {
      socket.off("online_users");
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, [socket]);

  const isUserOnline = (userId) => onlineUsers.has(userId);

  return (
    <OnlineUsersContext.Provider value={{ onlineUsers, isUserOnline }}>
      {children}
    </OnlineUsersContext.Provider>
  );
};
