"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/constants/constants";

const API_URL = BACKEND_URL;

const Leaderboard = ({ algorithm }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/scores/leaderboard/${algorithm}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        const data = await response.json();

        // Check if data is valid and is an array
        if (data && Array.isArray(data)) {
          setLeaderboardData(data);
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error("Invalid data format received");
        }

        setLoading(false);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        setError(err.message || "Failed to fetch leaderboard data");
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [algorithm]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!Array.isArray(leaderboardData)) return <div>No data available</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {algorithm.toUpperCase()} Leaderboard
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Player
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Moves
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboardData.map((entry, index) => (
              <tr
                key={entry._id}
                className={index % 2 === 0 ? "bg-gray-50" : ""}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {index + 1}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
