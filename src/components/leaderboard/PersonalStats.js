"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/constants/constants";

const PersonalStats = () => {
  const [personalStats, setPersonalStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("easy");
  const difficulties = ["easy", "medium", "hard"];

  useEffect(() => {
    const fetchPersonalStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your personal stats");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/scores/personal", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setPersonalStats(data);
      } catch (err) {
        console.error("Personal stats error:", err);
        setError(err.message || "Failed to fetch personal stats");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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

  const filteredStats = personalStats
    .filter(
      (stat) =>
        (stat.scores || []).filter((score) => score.difficulty === activeTab)
          .length > 0
    )
    .map((stat) => ({
      ...stat,
      scores: (stat.scores || []).filter(
        (score) => score.difficulty === activeTab
      ),
    }));

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-2 sm:px-4 py-3 sm:py-5">
        <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">
          Your Personal Stats
        </h3>
      </div>

      {/* Difficulty Tabs */}
      <div className="flex border-b border-gray-200">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => setActiveTab(difficulty)}
            className={`px-2 sm:px-4 py-2 border-b-2 font-medium text-xs sm:text-sm capitalize
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

      <div className="border-t border-gray-200">
        <div className="divide-y divide-gray-200">
          {filteredStats.map((stat) => (
            <div key={stat._id} className="px-2 sm:px-4 py-3 sm:py-5">
              <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-4">
                {stat._id.toUpperCase()} Top Scores
              </h4>
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-16">
                        Rank
                      </th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-16">
                        Total Score
                      </th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-16">
                        Submitted Time
                      </th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-16">
                        Total Moves
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stat.scores
                      .filter((score) => score.difficulty === activeTab)
                      .slice(0, 5)
                      .map((score, index) => (
                        <tr
                          key={score._id}
                          className={index % 2 === 0 ? "bg-gray-50" : ""}
                        >
                          <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap">
                            <span className="text-xs sm:text-sm text-gray-800">
                              {getMedalIcon(index + 1)} {index + 1}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-800">
                            {score.score}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-800">
                            {score.createdAt &&
                            new Date(score.createdAt).toString() !==
                              "Invalid Date"
                              ? new Date(score.createdAt).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                    timeZoneName: "short",
                                  }
                                )
                              : "N/A"}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-800">
                            {score.movesCount}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalStats;
