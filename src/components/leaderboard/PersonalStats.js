import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PersonalStats = () => {
  const [personalStats, setPersonalStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPersonalStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/scores/personal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPersonalStats(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch personal stats");
        setLoading(false);
      }
    };

    fetchPersonalStats();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Your Personal Best Scores
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <div className="divide-y divide-gray-200">
          {personalStats.map((stat) => (
            <div key={stat._id} className="px-4 py-5 sm:p-6">
              <h4 className="text-md font-medium text-gray-900 mb-2">
                {stat._id.toUpperCase()}
              </h4>
              <dl className="grid grid-cols-3 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Best Score
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {stat.bestScore}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Best Time
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {Math.floor(stat.bestTime / 1000)}s
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Best Moves
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {stat.bestMoves}
                  </dd>
                </div>
              </dl>
              <div className="mt-2 text-sm text-gray-500">
                Last played: {new Date(stat.lastPlayed).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalStats;