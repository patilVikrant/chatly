import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import "./ChatPage.css";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  return (
    <div
      className={`chat-page d-flex ${selectedUser ? "mobile-chat-active" : ""}`}
    >
      <Sidebar selectedUser={selectedUser} onSelectUser={setSelectedUser} />
      <ChatWindow
        selectedUser={selectedUser}
        onBack={() => setSelectedUser(null)}
      />
    </div>
  );
};

export default ChatPage;
