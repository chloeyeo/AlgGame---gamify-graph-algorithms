import { NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Please log in to view your personal stats" },
        { status: 401 }
      );
    }

    const response = await axios.get(`${API_URL}/api/scores/personal`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Personal stats API error:", error);

    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: "Please log in to view your personal stats" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch personal stats" },
      { status: 500 }
    );
  }
}
