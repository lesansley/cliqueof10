// `${process.env.REACT_APP_SERVER_URL}/search-friends`
// `${process.env.REACT_APP_SERVER_URL}/add-friend`

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FriendPage = ({ profile, setProfile }) => {
  const [potentialFriends, setPotentialFriends] = useState([]);
  const [currentFriends, setCurrentFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [invitesSent, setInvitesSent] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/friends/search`,
          {
            username: profile.username,
            hobbies: profile.hobbies,
          }
        );
        setPotentialFriends(response.data.potentialFriends);
        setCurrentFriends(response.data.friends);

        const requestsResponse = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/friends/requests?username=${profile.username}`
        );
        setFriendRequests(requestsResponse.data.friendRequests);

        const profileResponse = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/profile?username=${profile.username}`
        );
        setInvitesSent(profileResponse.data.invitesSent || []);
      } catch (error) {
        setError(error.response?.data?.error || "Error fetching friends data");
      }
    };

    fetchFriendsData();
  }, [profile]);

  const handleAddFriend = async (friendUsername) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/friends/send-request`,
        {
          username: profile.username,
          friendUsername,
        }
      );
      if (response.data.message) {
        setInvitesSent([...invitesSent, friendUsername]);
        setError(""); // Clear any existing error
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error sending friend request");
    }
  };

  const handleAcceptFriend = async (friendUsername) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/friends/accept-request`,
        {
          username: profile.username,
          friendUsername,
        }
      );
      if (response.data.message) {
        setFriendRequests((prev) =>
          prev.filter((friend) => friend !== friendUsername)
        );
        setCurrentFriends((prev) => [...prev, { username: friendUsername }]);
        setProfile((prevProfile) => ({
          ...prevProfile,
          friends: [...(prevProfile.friends || []), friendUsername],
        }));
        setError(""); // Clear any existing error
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error accepting friend request");
    }
  };

  const handleCancelInvite = async (friendUsername) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/friends/cancel-request`,
        {
          username: profile.username,
          friendUsername,
        }
      );
      if (response.data.message) {
        setInvitesSent((prev) =>
          prev.filter((invite) => invite !== friendUsername)
        );
        setError(""); // Clear any existing error
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error canceling friend request");
    }
  };

  const handleRemoveFriend = async (friendUsername) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/friends/remove-friend`,
        {
          username: profile.username,
          friendUsername,
        }
      );
      if (response.data.message) {
        setCurrentFriends((prev) =>
          prev.filter((friend) => friend.username !== friendUsername)
        );
        setProfile((prevProfile) => ({
          ...prevProfile,
          friends: prevProfile.friends.filter(
            (friend) => friend !== friendUsername
          ),
        }));
        setError(""); // Clear any existing error
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error removing friend");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Friends</h2>
        {error && <p className="text-red-500">{error}</p>}
        <p className="font-bold">Your Friends:</p>
        <ul className="mt-4 space-y-2">
          {currentFriends.map((friend) => (
            <li
              key={friend.username}
              className="flex justify-between items-center"
            >
              <span>{friend.username}</span>
              <button
                onClick={() => navigate(`/chat/${friend.username}`)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Chat
              </button>
              <button
                onClick={() => handleRemoveFriend(friend.username)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <p className="font-bold mt-8">Accept Friend Requests:</p>
        <ul className="mt-4 space-y-2">
          {friendRequests.map((friend) => (
            <li key={friend} className="flex justify-between items-center">
              <span>{friend}</span>
              <button
                onClick={() => handleAcceptFriend(friend)}
                className="bg-green-500 text-white p-2 rounded"
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
        <p className="font-bold mt-8">Invites Sent:</p>
        <ul className="mt-4 space-y-2">
          {invitesSent.map((friend) => (
            <li key={friend} className="flex justify-between items-center">
              <span>{friend}</span>
              <button
                onClick={() => handleCancelInvite(friend)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
        <p className="font-bold mt-8">Potential Friends:</p>
        <ul className="mt-4 space-y-2">
          {potentialFriends.map((friend) => (
            <li
              key={friend.username}
              className="flex justify-between items-center"
            >
              <span>{friend.username}</span>
              <button
                onClick={() => handleAddFriend(friend.username)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
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

export default FriendPage;
