import React, { useState } from "react";
import axios from "axios";

const Chat = ({ profile }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(profile.chat || []);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/send-message`, {
        username: profile.username,
        message,
      });
      setMessages([...messages, message]);
      setMessage("");
    } catch (error) {
      alert("Error sending message");
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={handleSend}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
