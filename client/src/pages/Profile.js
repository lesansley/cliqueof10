// `${process.env.REACT_APP_SERVER_URL}/update-profile`

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const hobbiesList = [
  "horse riding",
  "hang gliding",
  "pie eating",
  "pigeon fancying",
  "extreme ironing",
];

const Profile = ({ profile, setProfile }) => {
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setEmail(profile.email || "");
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setCountry(profile.country || "");
      setCity(profile.city || "");
      setHobbies(profile.hobbies || []);
    }
  }, [profile]);

  const handleLogout = () => {
    setProfile(null);
    navigate("/login");
  };

  const handleHobbyChange = (hobby) => {
    setHobbies((prevHobbies) =>
      prevHobbies.includes(hobby)
        ? prevHobbies.filter((h) => h !== hobby)
        : [...prevHobbies, hobby]
    );
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/update-profile`,
        {
          username: profile.username,
          bio,
          email,
          firstName,
          lastName,
          country,
          city,
          hobbies,
        }
      );
      if (response.data.message) {
        alert(response.data.message);
        setProfile({
          ...profile,
          bio,
          email,
          firstName,
          lastName,
          country,
          city,
          hobbies,
        });
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error updating profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Bio"
          />
          <div className="space-y-2">
            <p className="font-bold">Hobbies:</p>
            {hobbiesList.map((hobby) => (
              <div key={hobby} className="flex items-center">
                <input
                  type="checkbox"
                  checked={hobbies.includes(hobby)}
                  onChange={() => handleHobbyChange(hobby)}
                  className="mr-2"
                />
                <label>{hobby}</label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Update Profile
          </button>
        </form>
        <button
          onClick={() => navigate("/chat")}
          className="w-full bg-green-500 text-white p-2 rounded mt-4"
        >
          Go to Chat
        </button>
        <button
          onClick={() => navigate("/friends")}
          className="w-full bg-purple-500 text-white p-2 rounded mt-4"
        >
          Go to Friends
        </button>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white p-2 rounded mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
