import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import "./ChatPage.css";

const ChatPage = () => {
  return (
    <div className="chat-page d-flex">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default ChatPage;
