import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Friends from "./pages/Friends";
import "./index.css";

const App = () => {
  const [profile, setProfile] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setProfile={setProfile} />} />
        {profile && (
          <>
            <Route
              path="/profile"
              element={<Profile profile={profile} setProfile={setProfile} />}
            />
            <Route
              path="/chat/:friendUsername"
              element={<Chat profile={profile} />}
            />

            <Route
              path="/friends"
              element={<Friends profile={profile} setProfile={setProfile} />}
            />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
