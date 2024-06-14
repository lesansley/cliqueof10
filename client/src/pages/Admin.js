import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = ({ isAdmin }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // if (!isAdmin) {
    //   setError("Unauthorized access");
    //   return;
    // }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/admin/users`,
          {
            params: { isAdmin: true },
          }
        );
        setUsers(
          Object.entries(response.data).map(([username, profile]) => ({
            username,
            ...profile,
          }))
        );
      } catch (error) {
        setError(error.response?.data?.error || "Error fetching users");
      }
    };

    fetchUsers();
  }, [isAdmin]);

  const handleDeleteUser = async (username) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/admin/users/${username}`,
        {
          params: { isAdmin: true },
        }
      );
      setUsers(users.filter((user) => user.username !== username));
      setError("");
    } catch (error) {
      setError(error.response?.data?.error || "Error deleting user");
    }
  };

  // if (!isAdmin) {
  //   return <div>{error}</div>;
  // }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        {error && <p className="text-red-500">{error}</p>}
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.username}>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.firstName}</td>
                <td className="border px-4 py-2">{user.lastName}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDeleteUser(user.username)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
