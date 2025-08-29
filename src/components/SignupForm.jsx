// src/components/SignupForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [lookingFor, setLookingFor] = useState([]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Password length validation
  if (password.length < 6) {
    setError("Password must be at least 6 characters long.");
    return;
  }

  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/signup`, {
      email,
      gender,
      lookingFor,
      password,
    });

    if (res.data.success) {
      navigate(`/first-questions/${res.data.userId}`);
    }
  } catch (err) {
    console.error(err);
    setError("Error signing up. Please try again.");
  }
};

  return (
    <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
      
      {/* Email */}
      <div className="flex flex-col">
        <label className="mb-1 font-semibold">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="ml-4 p-2 border rounded w-full"
        />
      </div>

      {/* Gender */}
      <div className="flex flex-col">
        <label className="mb-1 font-semibold">Gender</label>
        <div className="ml-4 space-y-2">
          <label>
            <input
              type="radio"
              value="male"
              checked={gender === "male"}
              onChange={(e) => setGender(e.target.value)}
              required
            />{" "}
            Male
          </label>
          <label>
            <input
              type="radio"
              value="female"
              checked={gender === "female"}
              onChange={(e) => setGender(e.target.value)}
            />{" "}
            Female
          </label>
        </div>
      </div>

      {/* Looking For */}
      <div className="flex flex-col">
        <label className="mb-1 font-semibold">Looking For</label>
        <div className="ml-4 space-y-2">
          <label>
            <input
              type="checkbox"
              value="male"
              checked={lookingFor.includes("male")}
              onChange={(e) => {
                const checked = e.target.checked;
                setLookingFor((prev) =>
                  checked ? [...prev, "male"] : prev.filter((g) => g !== "male")
                );
              }}
            />{" "}
            Male
          </label>
          <label>
            <input
              type="checkbox"
              value="female"
              checked={lookingFor.includes("female")}
              onChange={(e) => {
                const checked = e.target.checked;
                setLookingFor((prev) =>
                  checked ? [...prev, "female"] : prev.filter((g) => g !== "female")
                );
              }}
            />{" "}
            Female
          </label>
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col">
        <label className="mb-1 font-semibold">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="ml-4 p-2 border rounded w-full"
        />
      </div>

      {/* Submit */}
      <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
        Sign Up
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
