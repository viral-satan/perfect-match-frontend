import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function UploadPhotoPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const API_BASE = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!photo) return;

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("photo", photo);

    try {
      const res = await axios.post(`${API_BASE}/users/uploadPhoto`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setSuccessMsg("Photo uploaded successfully!");
        setErrorMsg("");
        navigate(`/matches/${userId}`);
      } else {
        setErrorMsg("Upload failed. Try again.");
        setSuccessMsg("");
      }
    } catch (err) {
      setErrorMsg("Upload failed. Try again.");
      setSuccessMsg("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Your Photo</h1>
      <form onSubmit={handleUpload} className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded shadow-md">
        <input type="file" accept="image/*" onChange={handleChange} />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Upload Photo
        </button>
        {successMsg && <p className="text-green-600">{successMsg}</p>}
        {errorMsg && <p className="text-red-600">{errorMsg}</p>}
      </form>
    </div>
  );
}
