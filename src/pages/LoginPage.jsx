// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  if (password.length < 6) {
    setError("Password must be at least 6 characters long.");
    return;
  }

  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
      email,
      password,
    });

    if (res.data.success) {
      const user = res.data.user;
      if (user.answers.length < 5) {
        navigate(`/first-questions/${user._id}`);
      } else if (!user.photoUrl) {
        navigate(`/upload-photo/${user._id}`);
      } else {
        navigate(`/matches/${user._id}`);
      }
    }
  } catch (err) {
    console.error(err);
    setError("Login failed. Check your credentials.");
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome Back to PerfectMatch</h1>
      <p className="mb-6 text-center">
        Enter your credentials below to access your profile and continue building your matches.
      </p>
      <form className="flex flex-col w-full max-w-sm gap-4" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Log In
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}