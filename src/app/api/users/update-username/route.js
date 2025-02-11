import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/constants/constants";
import axios from "axios";

export async function PUT(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { username } = await request.json();

    const response = await axios.put(
      `${BACKEND_URL}/api/users/update-username`,
      { username },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Update username error:", error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to update username" },
      { status: error.response?.status || 500 }
    );
  }
}
