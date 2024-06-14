import React from "react";
import { useNavigate } from "react-router-dom";

const Friends = ({ profile }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Friends</h2>
        <p>Here you can manage your friends.</p>
        <button
          onClick={() => navigate("/profile")}
          className="w-full bg-blue-500 text-white p-2 rounded mt-4"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default Friends;
