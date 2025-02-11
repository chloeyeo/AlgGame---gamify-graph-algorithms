import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/constants/constants";
import axios from "axios";

export async function PUT(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const response = await axios.put(
      `${BACKEND_URL}/api/users/update-profile-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Failed to update profile image",
      },
      { status: error.response?.status || 500 }
    );
  }
}
