import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ref, onChildAdded, off } from "firebase/database";
import { db } from "../config/firebase-config.js";

const Chat = ({ profile }) => {
  const { friendUsername } = useParams();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/chat/history`,
          {
            params: { user1: profile.username, user2: friendUsername },
          }
        );
        console.log("Fetched chat history:", response.data); // Debugging line
        if (Array.isArray(response.data)) {
          setChatHistory(response.data);
        } else {
          setChatHistory([]);
        }
      } catch (error) {
        setError(error.response?.data?.error || "Error fetching chat history");
      }
    };

    fetchChatHistory();

    // Set up a listener for real-time updates
    const chatId = [profile.username, friendUsername].sort().join("_");
    const chatRef = ref(db, `chats/${chatId}`);

    const handleNewMessage = (snapshot) => {
      const newMessage = snapshot.val();
      console.log("New message received:", newMessage); // Debugging line
      setChatHistory((prevHistory) => {
        console.log("Previous chat history:", prevHistory); // Debugging line
        return [...prevHistory, newMessage];
      });
    };

    onChildAdded(chatRef, handleNewMessage);

    // Clean up the listener on unmount
    return () => {
      off(chatRef, "child_added", handleNewMessage);
    };
  }, [profile.username, friendUsername]);

  useEffect(() => {
    // Scroll to the bottom of the chat window whenever chat history changes
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;

    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/chat/send`, {
        sender: profile.username,
        recipient: friendUsername,
        message,
      });
      setMessage("");
      setError("");
    } catch (error) {
      setError(error.response?.data?.error || "Error sending message");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Chat with {friendUsername}</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4 overflow-y-auto max-h-96 border p-4 rounded">
          {chatHistory.length === 0 && <p>No messages yet</p>}
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`p-2 ${
                chat.sender === profile.username ? "text-right" : "text-left"
              }`}
            >
              <p
                className={`inline-block px-4 py-2 rounded ${
                  chat.sender === profile.username
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {chat.message}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(chat.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border rounded mr-2"
            placeholder="Type your message..."
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Send
          </button>
        </form>
        <button
          onClick={() => navigate("/profile")}
          className="mt-4 bg-green-500 text-white p-2 rounded"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default Chat;
