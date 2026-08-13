import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import EmojiPicker from "emoji-picker-react";

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const socket = useSocket();
  const { user } = useAuth();

  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!socket || !selectedUser) return;

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
        socket.emit("mark_as_read", selectedUser._id);
      }
    };

    fetchMessages();
  }, [socket, selectedUser]);

  useEffect(() => {
    if (!socket || !selectedUser) return;

    socket.on("receive_message", (payload) => {
      if (payload.sender === selectedUser._id) {
        setMessages((prevValue) => [...prevValue, payload]);

        socket.emit("mark_as_read", selectedUser._id);
      }
    });

    socket.on("message_sent", (payload) => {
      if (payload.receiver === selectedUser._id) {
        setMessages((prevValue) => [...prevValue, payload]);
      }
    });

    socket.on("user_typing", (payload) => {
      if (payload.senderId === selectedUser._id) {
        setIsOtherUserTyping(true);
      }
    });

    socket.on("user_stop_typing", (payload) => {
      if (payload.senderId === selectedUser._id) {
        setIsOtherUserTyping(false);
      }
    });

    socket.on("messages_read", (payload) => {
      if (payload.readerId === selectedUser._id) {
        setMessages((prevValue) =>
          prevValue.map((msg) =>
            msg.sender === user.id ? { ...msg, isRead: true } : msg,
          ),
        );
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_sent");
      socket.off("user_typing");
      socket.off("user_stop_typing");
      socket.off("messages_read");
      setIsOtherUserTyping(false);
    };
  }, [socket, selectedUser, user]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket || !selectedUser) return;

    if (!isTypingRef.current) {
      socket.emit("typing", selectedUser._id);
      isTypingRef.current = true;
    }

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", selectedUser._id);
      isTypingRef.current = false;
    }, 2000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    // console.log(newMessage);

    socket.emit("send_message", {
      receiverId: selectedUser._id,
      message: newMessage,
    });

    clearTimeout(typingTimeoutRef.current);
    socket.emit("stop_typing", selectedUser._id);
    isTypingRef.current = false;

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
                <span className="message-meta">
                  <span className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  {msg.sender === user.id && (
                    <span
                      className={`message-ticks ${msg.isRead ? "read" : ""}`}
                    >
                      {msg.isRead ? "✓✓" : "✓"}
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))}
        {isOtherUserTyping && (
          <p className="typing-indicator">
            {selectedUser.username} is typing...
          </p>
        )}
      </div>
      <form className="chat-input-bar" onSubmit={handleSend}>
        <div className="emoji-wrapper">
          <button
            type="button"
            className="emoji-toggle-btn"
            onClick={() => setShowEmojiPicker((prevValue) => !prevValue)}
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className="emoji-picker-popup">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  setNewMessage((prevValue) => prevValue + emojiData.emoji);
                }}
              />
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleTyping}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
