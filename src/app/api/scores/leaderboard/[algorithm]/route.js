import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/constants/constants";
import axios from "axios";

// process.env.BACKEND_URL
const API_URL = BACKEND_URL || "http://localhost:5000";

export async function GET(request, { params }) {
  try {
    const { algorithm } = params;
    const token = request.cookies.get("token")?.value;

    const response = await axios.get(
      `${API_URL}/api/scores/leaderboard/${algorithm}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
