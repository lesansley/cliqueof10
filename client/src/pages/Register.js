import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/register`,
        { username, password }
      );
      if (response.data.message) {
        alert("Login successful");
        navigate("/login"); // Navigate to login page
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error registering user");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-gray-700">Username</label>
          <p className="text-gray-500 text-sm">
            Username can only contain alphanumeric characters
          </p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Register
          </button>
        </form>
        <div className="my-4 text-center text-gray-500">or</div>
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-green-500 text-white p-2 rounded mt-4"
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default Register;
