"use client";
import { useState, useEffect } from "react";
// import axios from "axios";
// import { BACKEND_URL } from "@/constants/constants";

// const API_URL = BACKEND_URL;

const Leaderboard = ({ algorithm }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(`Fetching leaderboard for ${algorithm}...`);

        const response = await fetch(`/api/scores/leaderboard/${algorithm}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Received data for ${algorithm}:`, data);

        // Ensure we're working with valid data
        if (Array.isArray(data)) {
          // Map the data to ensure all required fields exist
          const processedData = data.map((entry) => ({
            _id: entry._id || `temp-${Math.random()}`,
            userId: {
              username: entry.userId?.username || "Anonymous",
            },
            score: entry.score || 0,
            timeSpent: entry.timeSpent || 0,
            movesCount: entry.movesCount || 0,
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
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase w-16"
              >
                Rank
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase"
              >
                Player
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase w-20"
              >
                Score
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase w-20"
              >
                Time
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase w-20"
              >
                Moves
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase w-24"
              >
                Difficulty
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboardData.slice(0, 5).map((entry, index) => (
              <tr
                key={entry._id}
                className={index % 2 === 0 ? "bg-gray-50" : ""}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-800">
                    {getMedalIcon(index + 1)} {index + 1}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {entry.userId.username}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {entry.score}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {Math.floor(entry.timeSpent / 1000)}s
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {entry.movesCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 capitalize">
                  {entry.difficulty}
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
