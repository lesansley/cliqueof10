import express from "express";
const router = express.Router();
import db from "../server.js";

// Endpoint to search friends
router.post("/search", async (req, res) => {
  const { username, hobbies } = req.body;

  if (!username || !hobbies || !Array.isArray(hobbies)) {
    return res.status(400).json({ error: "Username and hobbies are required" });
  }

  try {
    const usersSnapshot = await db.ref("users").once("value");
    const users = usersSnapshot.val();
    const potentialFriends = [];
    const friends = [];

    if (!users) {
      return res.status(200).json({ potentialFriends, friends });
    }

    const currentUser = users[username];
    const currentUserFriends = currentUser.profile.friends || [];

    Object.keys(users).forEach((userKey) => {
      if (userKey !== username) {
        const userProfile = users[userKey].profile;
        if (userProfile && userProfile.hobbies) {
          const sharedHobbies = userProfile.hobbies.filter((hobby) =>
            hobbies.includes(hobby)
          );

          if (sharedHobbies.length >= 2) {
            if (currentUserFriends.includes(userProfile.username)) {
              friends.push({ username: userProfile.username });
            } else {
              potentialFriends.push({ username: userProfile.username });
            }
          }
        }
      }
    });

    res.status(200).json({ potentialFriends, friends });
  } catch (error) {
    console.error("Error searching friends:", error);
    res.status(500).json({ error: "Error searching friends" });
  }
});

// Endpoint to send friend request
router.post("/send-request", async (req, res) => {
  const { username, friendUsername } = req.body;

  if (!username || !friendUsername) {
    return res
      .status(400)
      .json({ error: "Username and friend username are required" });
  }

  try {
    const userInvitesSentRef = db.ref(`users/${username}/profile/invitesSent`);
    const friendRequestsRef = db.ref(
      `users/${friendUsername}/profile/friendRequests`
    );
    const [userInvitesSentSnapshot, friendRequestsSnapshot] = await Promise.all(
      [userInvitesSentRef.once("value"), friendRequestsRef.once("value")]
    );

    const userInvitesSent = userInvitesSentSnapshot.val() || [];
    const friendRequests = friendRequestsSnapshot.val() || [];

    if (!userInvitesSent.includes(friendUsername)) {
      userInvitesSent.push(friendUsername);
      await userInvitesSentRef.set(userInvitesSent);
    }

    if (!friendRequests.includes(username)) {
      friendRequests.push(username);
      await friendRequestsRef.set(friendRequests);
    }

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ error: "Error sending friend request" });
  }
});

// Endpoint to accept friend request
router.post("/accept-request", async (req, res) => {
  const { username, friendUsername } = req.body;

  if (!username || !friendUsername) {
    return res
      .status(400)
      .json({ error: "Username and friend username are required" });
  }

  try {
    const userRef = db.ref(`users/${username}/profile`);
    const friendRequestsRef = userRef.child("friendRequests");
    const friendsRef = userRef.child("friends");

    // Remove friend request
    const friendRequestsSnapshot = await friendRequestsRef.once("value");
    const friendRequests = friendRequestsSnapshot.val() || [];
    const updatedFriendRequests = friendRequests.filter(
      (req) => req !== friendUsername
    );
    await friendRequestsRef.set(updatedFriendRequests);

    // Add to friends list
    const friendsSnapshot = await friendsRef.once("value");
    const friends = friendsSnapshot.val() || [];
    if (!friends.includes(friendUsername)) {
      friends.push(friendUsername);
      await friendsRef.set(friends);
    }

    // Remove from invitesSent of the friend
    const friendInvitesSentRef = db.ref(
      `users/${friendUsername}/profile/invitesSent`
    );
    const friendInvitesSentSnapshot = await friendInvitesSentRef.once("value");
    const friendInvitesSent = friendInvitesSentSnapshot.val() || [];
    const updatedFriendInvitesSent = friendInvitesSent.filter(
      (invite) => invite !== username
    );
    await friendInvitesSentRef.set(updatedFriendInvitesSent);

    // Also add the current user to the friend's friends list
    const friendProfileRef = db.ref(`users/${friendUsername}/profile`);
    const friendFriendsRef = friendProfileRef.child("friends");
    const friendFriendsSnapshot = await friendFriendsRef.once("value");
    const friendFriends = friendFriendsSnapshot.val() || [];
    if (!friendFriends.includes(username)) {
      friendFriends.push(username);
      await friendFriendsRef.set(friendFriends);
    }

    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ error: "Error accepting friend request" });
  }
});

// Endpoint to get friend requests
router.get("/requests", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const friendRequestsRef = db.ref(
      `users/${username}/profile/friendRequests`
    );
    const snapshot = await friendRequestsRef.once("value");
    const friendRequests = snapshot.val() || [];

    res.status(200).json({ friendRequests });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ error: "Error fetching friend requests" });
  }
});

// Endpoint to cancel friend request
router.post("/cancel-request", async (req, res) => {
  const { username, friendUsername } = req.body;

  if (!username || !friendUsername) {
    return res
      .status(400)
      .json({ error: "Username and friend username are required" });
  }

  try {
    // Remove from invitesSent of the user
    const userInvitesSentRef = db.ref(`users/${username}/profile/invitesSent`);
    const userInvitesSentSnapshot = await userInvitesSentRef.once("value");
    const userInvitesSent = userInvitesSentSnapshot.val() || [];
    const updatedUserInvitesSent = userInvitesSent.filter(
      (invite) => invite !== friendUsername
    );
    await userInvitesSentRef.set(updatedUserInvitesSent);

    // Remove from friendRequests of the friend
    const friendRequestsRef = db.ref(
      `users/${friendUsername}/profile/friendRequests`
    );
    const friendRequestsSnapshot = await friendRequestsRef.once("value");
    const friendRequests = friendRequestsSnapshot.val() || [];
    const updatedFriendRequests = friendRequests.filter(
      (request) => request !== username
    );
    await friendRequestsRef.set(updatedFriendRequests);

    res.status(200).json({ message: "Friend request canceled successfully" });
  } catch (error) {
    console.error("Error canceling friend request:", error);
    res.status(500).json({ error: "Error canceling friend request" });
  }
});

export default router;
