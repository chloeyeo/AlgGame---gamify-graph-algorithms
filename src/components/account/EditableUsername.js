"use client";
import { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";

const EditableUsername = ({ initialUsername, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(initialUsername);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      // Check if username is unchanged
      if (username === initialUsername) {
        setError("This is already your current username");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch("/api/users/update-username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Sorry, that username is already taken");
        }
        throw new Error(data.error || "Failed to update username");
      }

      // Update local storage with new username
      const userData = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...userData, username: username })
      );

      onUpdate(username);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit}
            className="px-3 py-1 text-sm text-white bg-blue-300 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setUsername(initialUsername);
              setError("");
            }}
            className="px-3 py-1 text-sm bg-gray-300 text-black hover:text-black"
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-medium">{username}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 text-black hover:text-gray-800 transition-colors"
      >
        <PencilIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default EditableUsername;
