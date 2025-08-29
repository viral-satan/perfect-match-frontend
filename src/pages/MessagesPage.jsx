// src/pages/MessagesPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const API_BASE = import.meta.env.VITE_API_URL;

export default function MessagesPage() {
  const { userId } = useParams();
  const [ratedMatches, setRatedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMatchId, setActiveMatchId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);

  // ---------------- Socket.IO ----------------
  useEffect(() => {
    socketRef.current = io(API_BASE);
    socketRef.current.emit("joinRoom", userId);

    socketRef.current.on("receiveMessage", (message) => {
      setChatMessages((prev) => {
        if (prev.find((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });

      if (activeMatchId === message.sender || activeMatchId === message.recipient) {
        scrollToBottom();
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, activeMatchId]);

  // ---------------- Fetch rated matches ----------------
  useEffect(() => {
    const fetchRatedMatches = async () => {
      try {
        const userRes = await axios.get(`${API_BASE}/users/${userId}`);
        if (!userRes.data.success) return setLoading(false);
        const currentUser = userRes.data.user;

        const ratingRes = await axios.get(`${API_BASE}/ratings/user/${userId}`);
        if (!ratingRes.data.success || ratingRes.data.ratings.length === 0) {
          setRatedMatches([]);
          setLoading(false);
          return;
        }

        const ratedUserIds = ratingRes.data.ratings.map((r) => r.ratedUser);
        const usersRes = await axios.post(`${API_BASE}/users/batch`, { ids: ratedUserIds });
        if (!usersRes.data.success) {
          setRatedMatches([]);
          setLoading(false);
          return;
        }

        const ratedUsers = usersRes.data.users;

        // ---------------- Updated point system ----------------
        const pointMap = [10, 8.5, 6.5, 4, 0]; // diff 0,1,2,3,>=4
        const attractivenessSimilarity = (diff) => {
          const k = 0.27;
          const maxDiff = 10;
          return Math.log(1 + k * (maxDiff - diff)) / Math.log(1 + k * maxDiff);
        };

        const computedMatches = ratedUsers.map((other) => {
          let answerScore = 0;
          if (currentUser.answers.length === other.answers.length) {
            for (let i = 0; i < currentUser.answers.length; i++) {
              const diff = Math.min(Math.abs(currentUser.answers[i] - other.answers[i]), 4);
              answerScore += pointMap[diff];
            }
          }

          const maxAnswerScore = currentUser.answers.length * 10;
          const answerPercent = (answerScore / maxAnswerScore) * 100;
          const weightedAnswer = answerPercent * 0.8;

          const absDiff = Math.abs(currentUser.attractiveness - other.attractiveness);
          const weightedAttractiveness = attractivenessSimilarity(absDiff) * 20;

          return {
            userId: other._id,
            photoUrl: other.photoUrl,
            // Keep as string to always show one decimal
            matchPercentage: (weightedAnswer + weightedAttractiveness).toFixed(1),
          };
        });

        const filtered = computedMatches
          .filter((m) => Number(m.matchPercentage) >= 80)
          .sort((a, b) => Number(b.matchPercentage) - Number(a.matchPercentage));

        setRatedMatches(filtered);
      } catch (err) {
        console.error("Error fetching rated matches:", err);
        setRatedMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRatedMatches();
  }, [userId]);

  // ---------------- Select a match ----------------
  const handleSelectMatch = async (matchId) => {
    if (activeMatchId === matchId) {
      setActiveMatchId(null);
      setChatMessages([]);
    } else {
      setActiveMatchId(matchId);
      try {
        const res = await axios.get(`${API_BASE}/messages/${userId}/${matchId}`);
        if (res.data.success) {
          setChatMessages(res.data.messages);
          setTimeout(scrollToBottom, 50);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setChatMessages([]);
      }
    }
  };

  // ---------------- Send message ----------------
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeMatchId) return;

    const message = {
      sender: userId,
      recipient: activeMatchId,
      content: newMessage.trim(),
    };

    setNewMessage("");
    socketRef.current.emit("sendMessage", message);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <Link
          to={`/matches/${userId}`}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Rate More Matches
        </Link>
      </div>

      {loading && <p>Loading rated matches...</p>}
      {!loading && ratedMatches.length === 0 && <p>No rated matches above 80%.</p>}

      <div className="flex flex-col w-full gap-4">
        {ratedMatches.map((match) => (
          <div
            key={match.userId}
            className="flex flex-col bg-white p-4 rounded shadow border border-gray-200"
          >
            <div className="flex items-center mb-2">
              {match.photoUrl && (
                <img
                  src={`${API_BASE}/uploads/${match.photoUrl}`}
                  alt="profile"
                  className="w-24 h-24 rounded-full object-cover mr-4"
                />
              )}
              <div className="flex flex-col">
                <p className="font-semibold">Compatibility: {match.matchPercentage}%</p>
                <button
                  className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => handleSelectMatch(match.userId)}
                >
                  {activeMatchId === match.userId ? "Close Chat" : "Message"}
                </button>
              </div>
            </div>

            {activeMatchId === match.userId && (
              <div className="flex flex-col bg-gray-100 p-2 rounded border mt-2">
                <div className="flex-1 overflow-y-auto mb-2 max-h-64">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`mb-1 p-2 rounded max-w-[70%] ${
                        msg.sender === userId
                          ? "bg-green-200 self-end text-right"
                          : "bg-gray-200 self-start text-left"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value.slice(0, 100))}
                    placeholder="Type a message..."
                    className="flex-1 border p-2 rounded-l"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
