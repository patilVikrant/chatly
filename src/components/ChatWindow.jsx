import { useEffect, useState } from "react";
import api from "../services/api";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/messages/${selectedUser._id}`);
        setMessages(res.data.messages);
      } catch (err) {
        console.log(
          "Error fetching messages:",
          err.response?.data?.message || err.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (!socket || !selectedUser) return;

    socket.on("receive_message", (payload) => {
      if (payload.sender === selectedUser._id) {
        setMessages((prevValue) => [...prevValue, payload]);
      }
    });

    socket.on("message_sent", (payload) => {
      if (payload.receiver === selectedUser._id) {
        setMessages((prevValue) => [...prevValue, payload]);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_sent");
    };
  }, [socket, selectedUser]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    // console.log(newMessage);

    socket.emit("send_message", {
      receiverId: selectedUser._id,
      message: newMessage,
    });

    setNewMessage("");
  };

  if (!selectedUser) {
    return (
      <div className="chat-window chat-window-empty">
        <p>Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="user-avatar">
          {selectedUser.username.charAt(0).toUpperCase()}
        </div>
        <span className="user-name-header">{selectedUser.username}</span>
      </div>
      <div className="chat-messages">
        {loading && <p className="status-text">Loading messages...</p>}
        {!loading && messages.length === 0 && (
          <p className="status-text">No messages yet. Say hi!</p>
        )}
        {!loading &&
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`message-row ${msg.sender === user.id ? "sent" : "received"}`}
            >
              <div className="message-bubble">
                <p className="message-text">{msg.message}</p>
              </div>
            </div>
          ))}
      </div>
      <form className="chat-input-bar" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
