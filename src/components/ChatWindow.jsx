import { useEffect, useState } from "react";
import api from "../services/api";

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

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
            <div key={msg._id}>
              {msg.sender}: {msg.message}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatWindow;
