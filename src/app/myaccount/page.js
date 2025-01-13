"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const MyAccountPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        router.push("/auth");
        return;
      }

      setUser(JSON.parse(userData));
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">My Account</h1>

        <div className="space-y-4">
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
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Account Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="border rounded p-4">
                <label className="block text-sm font-medium text-gray-600">
                  Username
                </label>
                <p className="mt-1">{user?.username}</p>
              </div>
              <div className="border rounded p-4">
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <p className="mt-1">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
