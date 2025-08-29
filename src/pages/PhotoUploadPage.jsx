// src/pages/PhotoUploadPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export default function PhotoUploadPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!file) {
      setError("Please select a photo to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file); // must match upload.single("photo")

    try {
      const res = await axios.post(`${API_BASE}/users/upload-photo/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setMessage("Photo uploaded successfully!");
        setFile(null);
        navigate(`/matches/${userId}`); // instant redirect
      } else {
        setError("File upload failed: " + res.data.message);
      }
    } catch (err) {
      console.error("Photo upload error:", err);
      setError("Error uploading photo: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Upload Your Photo</h1>
      <form className="flex flex-col items-center gap-4" onSubmit={handlePhotoUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
}
