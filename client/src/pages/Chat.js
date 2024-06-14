import React, { useState } from "react";
import axios from "axios";

const Chat = ({ profile }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(profile.chat || []);
  const [error, setError] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/send-message`,
        { username: profile.username, message }
      );
      setMessages([...messages, message]);
      setMessage("");
    } catch (error) {
      setError(error.response.data.error || "Error sending message");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Chat</h2>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="space-y-2 mb-4">
          {messages.map((msg, index) => (
            <li key={index} className="bg-gray-200 p-2 rounded">
              {msg}
            </li>
          ))}
        </ul>
        <form onSubmit={handleSend} className="space-y-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
