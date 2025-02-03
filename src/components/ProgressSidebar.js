import React, { useState, useEffect } from "react";
import { ACHIEVEMENT_DEFINITIONS } from "@/constants/achievements";

const ProgressSidebar = () => {
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    bestScore: 0,
    achievementsCount: 0,
  });

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem("token");
      const [achievementsRes, statsRes] = await Promise.all([
        fetch("/api/achievements", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/scores/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (achievementsRes.ok) {
        const data = await achievementsRes.json();
        setAchievements(data.achievements || []);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div className="fixed right-0 top-20 h-screen w-64 bg-white shadow-lg p-4">
      <h3 className="font-bold text-lg mb-4">Your Progress</h3>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Total Games</p>
          <p className="text-xl font-semibold">{stats.totalGames}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Best Score</p>
          <p className="text-xl font-semibold">{stats.bestScore}</p>
        </div>

        <div>
          <p className="text-sm text-black">Achievements</p>
          <p className="text-xl font-semibold">
            {achievements.length} /{" "}
            {Object.keys(ACHIEVEMENT_DEFINITIONS).length}
          </p>
        </div>

        <div className="mt-4">
          <h4 className="font-medium mb-2">Recent Achievements</h4>
          {achievements.slice(0, 3).map((achievement) => (
            <div
              key={achievement.type}
              className="flex items-center gap-2 text-sm"
            >
              <span>{ACHIEVEMENT_DEFINITIONS[achievement.type].icon}</span>
              <span>{ACHIEVEMENT_DEFINITIONS[achievement.type].title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressSidebar;
