"use client";
import { useState, useEffect } from "react";
// import axios from "axios";
// import { BACKEND_URL } from "@/constants/constants";

// const API_URL = BACKEND_URL;

const Leaderboard = ({ algorithm }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("easy");
  const difficulties = ["easy", "medium", "hard"];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(`Fetching leaderboard for ${algorithm}...`);

        const response = await fetch(
          `/api/scores/leaderboard/${algorithm}?difficulty=${activeTab}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Received data for ${algorithm}:`, data);

        if (Array.isArray(data)) {
          const processedData = data.map((entry) => ({
            _id: entry._id || `temp-${Math.random()}`,
            userId: {
              username: entry.userId?.username || "Anonymous",
            },
            score: entry.score || 0,
            timeSpent: entry.timeSpent || 0,
            movesCount: entry.movesCount || 0,
            difficulty: entry.difficulty || "easy",
          }));
          setLeaderboardData(processedData);
        } else {
          setLeaderboardData([]);
        }
      } catch (err) {
        console.error(`Leaderboard fetch error for ${algorithm}:`, err);
        setError(err.message || "Failed to fetch leaderboard data");
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [algorithm]);

  const filteredData = leaderboardData.filter(
    (entry) => entry.difficulty === activeTab
  );

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold capitalize mb-4">{algorithm}</h2>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold capitalize mb-4">{algorithm}</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {algorithm.toUpperCase()} Leaderboard
        </h3>
      </div>

      {/* Difficulty Tabs */}
      <div className="flex border-b border-gray-200">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => setActiveTab(difficulty)}
            className={`px-4 py-2 border-b-2 font-medium text-sm capitalize
              ${
                activeTab === difficulty
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-800 hover:text-gray-700 hover:border-gray-700"
              }`}
          >
            {difficulty}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase w-16">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase">
                Player
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase w-20">
                Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase w-20">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase w-20">
                Moves
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.slice(0, 5).map((entry, index) => (
              <tr
                key={entry._id}
                className={index % 2 === 0 ? "bg-gray-50" : ""}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-800">
                    {getMedalIcon(index + 1)} {index + 1}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {entry.userId.username}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                  {entry.score}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                  {Math.floor(entry.timeSpent / 1000)}s
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                  {entry.movesCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
