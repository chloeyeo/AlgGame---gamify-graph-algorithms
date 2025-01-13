"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Leaderboard from "@/components/leaderboard/Leaderboard";
import PersonalStats from "@/components/leaderboard/PersonalStats";

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.replace("/auth");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      router.replace("/auth");
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="space-y-8">
        <div className="bg-blue-50 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome, {user.username}!
          </h1>
          <PersonalStats />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {[
            "dfs",
            "bfs",
            "dijkstra",
            "astar",
            "kruskal",
            "prim",
            "fordFulkerson",
            "edmondsKarp",
          ].map((algorithm) => (
            <Leaderboard key={algorithm} algorithm={algorithm} />
          ))}
        </div>
      </div>
    </div>
  );
}
