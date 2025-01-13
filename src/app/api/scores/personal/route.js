import { NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      console.error("No token found in cookies");
      return NextResponse.json(
        { error: "Authentication token not found" },
        { status: 401 }
      );
    }

    console.log("Fetching personal stats...");
    const response = await axios.get(`${API_URL}/api/scores/personal`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.data) {
      throw new Error("No data received from server");
    }

    console.log("Personal stats received:", response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Personal stats API error:", error.response?.data || error);
    return NextResponse.json(
      {
        error: "Failed to fetch personal stats",
        details: error.response?.data?.message || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
