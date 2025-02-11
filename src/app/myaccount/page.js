"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Sidebar from "@/components/Sidebar";
import AchievementDisplay from "@/components/profile/AchievementDisplay";
import { PencilIcon } from "@heroicons/react/24/outline";

export default function MyAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
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
      setNewUsername(JSON.parse(userData).username);
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/auth");
    }
  }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
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
        } else {
          console.error(
            "Failed to fetch achievements:",
            await achievementsRes.text()
          );
        }

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        } else {
          console.error("Failed to fetch stats:", await statsRes.text());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
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

  const handleUsernameUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users/update-username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update username");
      }

      // Update local storage
      const userData = JSON.parse(localStorage.getItem("user"));
      const updatedUser = { ...userData, username: newUsername };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-gray-50 bg-opacity-40 rounded-lg shadow-md p-4 lg:p-6 mb-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Account</h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="mb-6 border-b flex">
            <button
              className={`flex-1 px-2 lg:px-4 py-2 text-sm lg:text-base ${
                activeTab === "details" ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setActiveTab("details")}
            >
              Account Details
            </button>
            <button
              className={`flex-1 px-2 lg:px-4 py-2 text-sm lg:text-base ${
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
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <img
                    src="/images/lion.png"
                    alt="Profile"
                    className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-contain"
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
                    <div className="mt-1 flex items-center gap-2">
                      {isEditing ? (
                        <div className="flex flex-col w-full gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newUsername}
                              onChange={(e) => setNewUsername(e.target.value)}
                              className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={handleUsernameUpdate}
                              className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setIsEditing(false);
                                setNewUsername(user.username);
                                setError("");
                              }}
                              className="px-3 py-1 text-sm bg-gray-100 rounded text-black hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                          </div>
                          {error && (
                            <p className="text-sm text-red-500">{error}</p>
                          )}
                        </div>
                      ) : (
                        <>
                          <p>{user.username}</p>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="p-1 text-black hover:text-gray-800"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
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
                  <button className="w-full px-4 py-2 text-left border rounded active:bg-gray-50 hover:bg-gray-50 transition-colors">
                    Change Password
                  </button>
                  <button className="w-full px-4 py-2 text-left border rounded active:bg-gray-50 hover:bg-gray-50 transition-colors">
                    Update Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left border rounded active:bg-gray-50 hover:bg-gray-50 transition-colors">
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
