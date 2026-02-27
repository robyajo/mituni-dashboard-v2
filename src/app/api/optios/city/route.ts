import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    // Parse request body as FormData since client sends FormData
    const formData = await request.formData();
    const province_id = formData.get("province_id");

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/options/kota`;

    // Use URLSearchParams for simple data forwarding
    // This avoids complex multipart boundary handling in Node.js
    const payload = new URLSearchParams();
    if (province_id) {
      payload.append("province_id", province_id.toString());
    }

    const response = await axios.post(apiUrl, payload, {
      headers: {
        Accept: "application/json",
      },
    });

    // Axios stores the response body in .data, and it's already parsed if JSON
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      "Error fetching city options:",
      error?.response?.data || error.message,
    );
    return NextResponse.json(
      {
        error:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat memproses permintaan",
      },
      { status: error?.response?.status || 500 },
    );
  }
}
