import { useEffect, useState } from "react";
import api from "../services/api";

const Sidebar = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        {loading && <p className="sidebar-status">Loading users...</p>}

        {!loading && users.length === 0 && (
          <p className="sidebar-status">No other users yet</p>
        )}

        {!loading &&
          users.map((user) => (
            <div key={user._id} className="user-item">
              <div className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user.username}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
