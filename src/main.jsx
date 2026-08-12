import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { SocketProvider } from "./context/SocketProvider.jsx";
import { OnlineUsersProvider } from "./context/OnlineUsersProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <OnlineUsersProvider>
          <App />
        </OnlineUsersProvider>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>,
);
