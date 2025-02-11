import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/constants/constants";
import axios from "axios";

export async function DELETE(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const response = await axios.delete(
      `${BACKEND_URL}/api/users/delete-profile-image`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Failed to delete profile image",
      },
      { status: error.response?.status || 500 }
    );
  }
}
