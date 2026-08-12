import { useEffect, useState } from "react";
import api from "../services/api";
import { useOnlineUsers } from "../context/OnlineUsersContext";

const Sidebar = ({ selectedUser, onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log(selectedUser);
  const { isUserOnline } = useOnlineUsers();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data.users);
      } catch (err) {
        console.log(
          "Error fetching users:",
          err.response?.data?.message || err.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Chatly</h2>
      </div>
      <div className="sidebar-users">
        {loading && <p className="status-text">Loading users...</p>}

        {!loading && users.length === 0 && (
          <p className="status-text">No other users yet</p>
        )}

        {!loading &&
          users.map((user) => (
            <div
              key={user._id}
              className={`user-item ${selectedUser?._id === user._id ? "active" : ""}`}
              onClick={() => onSelectUser(user)}
            >
              <div className="user-avatar-wrapper">
                <div className="user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                {isUserOnline(user._id) && <span className="online-dot" />}
              </div>
              <span className="user-name">{user.username}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
