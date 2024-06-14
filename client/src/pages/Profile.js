import React, { useState } from "react";
import axios from "axios";

const Profile = ({ profile }) => {
  const [bio, setBio] = useState(profile.bio);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/update-profile`, {
        username: profile.username,
        bio,
      });
      alert("Profile updated successfully");
    } catch (error) {
      alert("Error updating profile");
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {profile.username}</p>
      <form onSubmit={handleUpdate}>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
