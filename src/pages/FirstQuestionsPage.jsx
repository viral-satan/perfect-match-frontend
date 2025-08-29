// src/pages/FirstQuestionsPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function FirstQuestionsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Updated 20 first questions
  const questions = [
  "When building a relationship, I feel most fulfilled when I can share my thoughts and feelings openly, feel understood emotionally, and engage in mutual experiences that are meaningful to both partners.",
  "I often seek reassurance from my partner but can balance it with independence when needed.",
  "I feel most loved when my partner expresses affection in multiple ways, such as words, time, acts, touch, or gifts.",
  "I am comfortable communicating my desires and boundaries, and I enjoy exploring intimacy in ways that strengthen emotional connection.",
  "I reflect on my own behavior and motivations to improve how I interact in relationships.",
  "I feel secure when my partner shares their feelings openly with me.",
  "I prefer a partner who can balance emotional closeness with respect for personal space.",
  "I enjoy exploring ideas and possibilities with my partner, even if they challenge my usual perspective.",
  "I often anticipate my partner’s needs and respond to them without being asked.",
  "I feel comfortable expressing vulnerability, even when unsure how my partner will react.",
  "Physical touch, such as holding hands or hugging, is important for my emotional connection.",
  "I feel most valued when my partner spends quality time with me.",
  "I am comfortable discussing sexual preferences and fantasies with a partner.",
  "Acts of service, like helping with tasks, make me feel cared for in a relationship.",
  "I enjoy spontaneous intimacy as much as planned, meaningful moments.",
  "I often try to understand my partner’s perspective before responding in disagreements.",
  "I appreciate verbal affirmations and compliments from my partner.",
  "I am open to experimenting and adapting to my partner’s needs in intimacy.",
  "I feel most connected when we share meaningful experiences, such as trips, projects, or hobbies.",
  "I reflect on my past relationships to better understand what works and what doesn’t for me."
];

  const [answers, setAnswers] = useState(Array(questions.length).fill(3));

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = Number(value);
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const numericAnswers = answers.map((ans) => Number(ans));
      await axios.post(`${import.meta.env.VITE_API_URL}/users/answers/${userId}`, {
        answers: numericAnswers,
      });
      navigate(`/upload-photo/${userId}`);
    } catch (err) {
      console.error(err);
      alert("Error submitting answers. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Your First Questions</h1>
      <p className="mb-6 text-center">
        Answer these 20 questions honestly to get your first match results. Use a scale of 1 (least agree) to 5 (most agree).
      </p>
      <form className="flex flex-col w-full max-w-2xl gap-6" onSubmit={handleSubmit}>
        {questions.map((q, i) => (
          <div key={i} className="flex flex-col gap-2">
            <label className="font-medium">{q}</label>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={num}
                    checked={answers[i] === num}
                    onChange={() => handleChange(i, num)}
                    required
                  />
                  {num}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit Answers
        </button>
      </form>
    </div>
  );
}
