import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
        email,
        password,
      });

      if (response.data.success) {
        // Redirect to first questions page
        navigate(`/first-questions/${response.data.userId}`);
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("Error logging in. Please try again.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex flex-col">
        <label htmlFor="email" className="font-semibold">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border px-2 py-1 rounded"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="password" className="font-semibold">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border px-2 py-1 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
      >
        Log In
      </button>
    </form>
  );
}
