"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Leaderboard from "@/components/leaderboard/Leaderboard";
import PersonalStats from "@/components/leaderboard/PersonalStats";

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const algorithms = [
    "dfs",
    "bfs",
    "dijkstra",
    "astar",
    "kruskal",
    "prim",
    "fordFulkerson",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.replace("/auth?redirect=/leaderboard");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.replace("/auth?redirect=/leaderboard");
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-2 sm:px-4 py-20 mb-8">
      <div className="space-y-4 sm:space-y-8">
        <div className="bg-blue-50 rounded-lg shadow-lg p-3 sm:p-6 mt-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Welcome, {user.username}!
          </h1>
          <PersonalStats />
        </div>

        <div className="grid gap-4 sm:gap-8 md:grid-cols-2">
          {Array.isArray(algorithms) &&
            algorithms.map((algorithm) => (
              <Leaderboard key={algorithm} algorithm={algorithm} />
            ))}
        </div>
      </div>
    </div>
  );
}
