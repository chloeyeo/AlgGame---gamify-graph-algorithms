import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/constants/constants";

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
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { message: "No image file provided" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/api/users/update-profile-image`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Non-JSON response:", await response.text());
      throw new Error("Server returned invalid response");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile image");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Profile image upload error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update profile image" },
      { status: 500 }
    );
  }
}
