# Chatly

A full stack real-time chat application built with the MERN stack. Chatly lets users register, find other users, and chat 1-to-1 in real time with typing indicators, read receipts, timestamps and emoji support.

---

## 🔗 Live Demo

🌐 [Chatly App](https://chatly-kappa-sand.vercel.app)

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/patilVikrant/chatly.git

# Navigate to project
cd chatly

# Install dependencies
npm install

# Create .env file and add your environment variables
# Refer to Environment Variables section below

# Start development server
npm run dev
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the project and add the following:

```
VITE_BACKEND_URL=your_backend_url_here
```

For local development use your local backend URL:

```
VITE_BACKEND_URL=http://localhost:5001
```

For production use your deployed backend URL:

```
VITE_BACKEND_URL=https://your-backend-url.onrender.com
```

---

## 🛠️ Tech Stack

| Technology         | Purpose                               |
| ------------------ | ------------------------------------- |
| React + Vite       | Frontend framework                    |
| React Router DOM   | Client side routing                   |
| Axios              | API calls with JWT interceptor        |
| Socket.IO Client   | Real-time bidirectional communication |
| Bootstrap          | Layout and responsive grid            |
| Custom CSS         | Component and theme styling           |
| React Context      | Auth, socket and online users state   |
| emoji-picker-react | Emoji picker for messages             |
| React Icons        | Icon library                          |

---

## Demo Video

Watch a walkthrough of all the major features of this app:
[Video](https://drive.google.com/file/d/1KLdeoGRHOkLcCdyslRpZQ4kYr6_xkzUU/view?usp=sharing)

---

## ✨ Features

### 🔐 Authentication

- User registration with username, email and password
- User login with JWT token stored in localStorage
- Protected routes — redirects to login if not authenticated
- Logout clears token, user and socket connection
- Show/hide password toggle on login and register

### 💬 Real-Time Messaging

- 1-to-1 private chat using Socket.IO rooms
- Message history loaded from database on selecting a user
- Instant delivery of new messages without refreshing
- Sent and received messages visually distinguished with bubble styling
- Timestamps on every message

### ⌨️ Typing Indicator

- "User is typing..." shown in real time while the other person types
- Debounced typing detection — one event on start, one on pause or send
- Scoped to the currently open conversation only

### ✅ Read Receipts

- Single tick for sent and delivered messages
- Double tick, shown in a different color, once the message is read
- Updates live if both users are online

### 🟢 Online / Offline Status

- Green dot on a user's avatar when they are online
- Updates live as users connect and disconnect

### 😊 Emoji Picker

- Emoji picker attached to the message input
- Selected emoji appended to the current message text

### ⚙️ Settings

- Update profile — username and email
- Change password — with current password verification
- Delete account — removes user and all their messages

### 📱 Responsive Design

- Mobile first approach
- Sidebar and chat window stack on smaller screens
- Back button to return to the sidebar on mobile
- Layout adapts across mobile, tablet and desktop

---

## 📁 Folder Structure

```
src/
├── assets/
│   └── chatly-logo.svg       # App logo used in sidebar header
├── components/
│   ├── ChatWindow.jsx        # Message list, input, typing and read receipts
│   ├── ProtectedRoute.jsx    # Route guard for authenticated pages
│   └── Sidebar.jsx           # User list, online status, logout
├── context/
│   ├── AuthContext.jsx       # Auth context object and useAuth hook
│   ├── AuthProvider.jsx      # Auth state, login and logout logic
│   ├── SocketContext.jsx     # Socket context object and useSocket hook
│   ├── SocketProvider.jsx    # Socket connection lifecycle
│   ├── OnlineUsersContext.jsx    # Online users context and useOnlineUsers hook
│   └── OnlineUsersProvider.jsx   # Online users tracking via socket events
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ChatPage.jsx
│   ├── Settings.jsx
│   ├── Auth.css
│   ├── ChatPage.css
│   └── Settings.css
├── services/
│   └── api.js                 # Axios instance with base URL and JWT interceptor
├── App.jsx                   # Routes and layout
├── index.css                  # Global styles and CSS variables
└── main.jsx                   # App entry point, provider tree
```

---

## 🔗 Related Repositories

- 🔧 [Chatly Backend](https://github.com/patilVikrant/chatly-backend)

---

## 👨‍💻 Author

**Vikrant Patil**

- GitHub: [@patilVikrant](https://github.com/patilVikrant)

---

## Contact

For bugs and feature requests, please reach out to pvikrant248@gmail.com
