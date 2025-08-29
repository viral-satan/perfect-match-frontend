// src/pages/MatchesPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

// Helper to map slider difference to backend point system
const getPointFromDiff = (diff) => {
  const pointMap = [10, 8.5, 6.5, 4, 0]; // diff 0,1,2,3,>=4
  return diff >= 4 ? pointMap[4] : pointMap[diff];
};

export default function MatchesPage() {
  const { userId } = useParams();
  const [matches, setMatches] = useState([]);
  const [ratings, setRatings] = useState({});        // submitted ratings
  const [sliderValues, setSliderValues] = useState({}); // live slider values

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`${API_BASE}/matches/${userId}`);
        if (!res.data.success) return setMatches([]);

        let fetchedMatches = res.data.matches;

        // Fetch submitted ratings
        const ratingRes = await axios.get(`${API_BASE}/ratings/user/${userId}`);
        let prevRatings = {};
        if (ratingRes.data.success) {
          ratingRes.data.ratings.forEach(r => {
            prevRatings[r.ratedUser] = r.value;
          });
        }

        // Remove already rated matches
        fetchedMatches = fetchedMatches.filter(m => !prevRatings[m.userId]);

        setMatches(fetchedMatches);

        // Initialize slider values to 5 (midpoint) if not already
        const initialSliders = {};
        fetchedMatches.forEach(m => {
          initialSliders[m.userId] = m.attractiveness ?? 5;
        });
        setSliderValues(initialSliders);

        setRatings(prevRatings);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMatches();
  }, [userId]);

  const handleSliderChange = (matchId, value) => {
    setSliderValues(prev => ({ ...prev, [matchId]: Number(value) }));
  };

  const handleSubmitRating = async (matchId) => {
    if (ratings[matchId] !== undefined) return;

    try {
      const sliderValue = sliderValues[matchId] ?? 5;

      // Map difference from midpoint (5) to backend point system
      const diffFromMid = Math.round(Math.abs(5 - sliderValue));
      const pointValue = getPointFromDiff(diffFromMid);

      await axios.post(`${API_BASE}/ratings`, { userId, matchId, rating: pointValue });

      setRatings(prev => ({ ...prev, [matchId]: pointValue }));
      setMatches(prevMatches => prevMatches.filter(m => m.userId !== matchId));

      alert("Rating submitted!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-3">Your Matches</h1>

      <Link
        to={`/messages/${userId}`}
        className="mb-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Go to Messages
      </Link>

      {matches.length === 0 && <p>No matches found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {matches.map(match => {
          const hasRated = ratings[match.userId] !== undefined;
          const sliderValue = sliderValues[match.userId] ?? 5;

          return (
            <div key={match.userId} className="flex flex-col items-center bg-white p-4 rounded shadow">
              {match.photoUrl && (
                <img
                  src={`${API_BASE}/uploads/${match.photoUrl}`}
                  alt="profile"
                  className="w-40 h-40 rounded-full object-cover"
                />
              )}

              <div className="mt-4 w-full flex flex-col items-center">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={sliderValue}
                  disabled={hasRated}
                  onChange={e => handleSliderChange(match.userId, e.target.value)}
                  className="w-full h-2 rounded-lg"
                />
                <p className="mt-1">
                  {hasRated
                    ? `Your Rating: ${ratings[match.userId]}`
                    : `Rating: ${sliderValue}`}
                </p>
                {!hasRated && (
                  <button
                    onClick={() => handleSubmitRating(match.userId)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Submit Rating
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
