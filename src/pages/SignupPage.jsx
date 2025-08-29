import React from "react";
import SignupForm from "../components/SignupForm.jsx";
import { Link } from "react-router-dom";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Welcome to PerfectMatch!
      </h1>
      <p className="text-center mb-8 max-w-lg text-gray-700">
        Create your account to start building meaningful connections.
        PerfectMatch helps you find compatible partners by analyzing your
        preferences and relationship values. Fill out the form below to begin
        your journey!
      </p>

      <SignupForm />

      <div className="mt-6 text-center">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-500 hover:underline font-semibold"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
