import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/constants/constants";
import axios from "axios";

// process.env.BACKEND_URL
const API_URL = BACKEND_URL || "http://localhost:5000";

export async function GET(request, { params }) {
  try {
    const { algorithm } = params;
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const response = await axios.get(
      `${API_URL}/api/scores/leaderboard/${algorithm}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Ensure we're returning an array
    const data = response.data;
    if (!Array.isArray(data)) {
      console.error("Invalid data format received:", data);
      return NextResponse.json([], { status: 200 }); // Return empty array instead of error
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json([], { status: 200 }); // Return empty array on error
  }
}
