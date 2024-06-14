import React, { useState } from "react";
import axios from "axios";

const Profile = ({ profile }) => {
  const [bio, setBio] = useState(profile.bio);
  const [error, setError] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/update-profile`,
        { username: profile.username, bio }
      );
      alert(response.data.message);
    } catch (error) {
      setError(error.response.data.error || "Error updating profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        {error && <p className="text-red-500">{error}</p>}
        <p>Username: {profile.username}</p>
        <form onSubmit={handleUpdate} className="space-y-4">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
