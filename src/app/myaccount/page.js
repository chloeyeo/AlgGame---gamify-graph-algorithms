"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Sidebar from "@/components/Sidebar";
import AchievementDisplay from "@/components/profile/AchievementDisplay";

export default function MyAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    bestScores: {},
    achievementsCount: 0,
  });

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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/auth");
    }
  }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
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

    fetchUserData();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    toast.success("Signed out successfully");
    router.replace("/auth");
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-gray-50 bg-opacity-40 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Account</h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="mb-6 border-b">
            <button
              className={`px-4 py-2 ${
                activeTab === "details" ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setActiveTab("details")}
            >
              Account Details
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "achievements" ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setActiveTab("achievements")}
            >
              Achievements
            </button>
          </div>

          {activeTab === "details" ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <img
                    src="/images/lion.png"
                    alt="Profile"
                    className="w-16 h-16 rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user?.username}</h2>
                  <p className="text-gray-600 bg-black bg-opacity-30 p-1">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="border rounded p-4">
                    <label className="block text-sm font-medium text-gray-600 bg-black bg-opacity-30 p-1">
                      Username
                    </label>
                    <p className="mt-1">{user?.username}</p>
                  </div>
                  <div className="border rounded p-4">
                    <label className="block text-sm font-medium text-gray-600 bg-black bg-opacity-30 p-1">
                      Email
                    </label>
                    <p className="mt-1">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <button className="w-full px-4 py-2 text-left border rounded hover:bg-gray-50">
                    Change Password
                  </button>
                  <button className="w-full px-4 py-2 text-left border rounded hover:bg-gray-50">
                    Update Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left border rounded hover:bg-gray-50">
                    Notification Settings
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <AchievementDisplay earnedAchievements={achievements} />
          )}
        </div>
      </div>
    </div>
  );
}
