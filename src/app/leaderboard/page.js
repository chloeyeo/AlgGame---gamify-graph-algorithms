"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Leaderboard from "@/components/leaderboard/Leaderboard";
import PersonalStats from "@/components/leaderboard/PersonalStats";

export default function LeaderboardPage() {
  const { user, loading } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading, router]);

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
