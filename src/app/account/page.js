"use client";
import { useState } from "react";
import EditableUsername from "@/components/account/EditableUsername";

export default function AccountPage() {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  });

  const handleUsernameUpdate = (newUsername) => {
    setUser((prev) => ({ ...prev, username: newUsername }));
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Account Details</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <EditableUsername
                initialUsername={user.username}
                onUpdate={handleUsernameUpdate}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
