import { NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const body = await request.json();

    const response = await axios.post(`${API_URL}/api/scores`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Score submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit score" },
      { status: 500 }
    );
  }
}
