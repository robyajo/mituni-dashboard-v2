import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";
import { checkIsFrozen, recordFailure, resetLimit } from "@/lib/rate-limit";

// Instance Axios khusus untuk Proxy Server-to-Server
const proxyAxios = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Samakan dengan config lib/axios
  }),
  timeout: 60000,
});

export async function POST(request: Request) {
  let email: string | undefined;
  try {
    const contentType = request.headers.get("content-type") || "";
    const registerUrl = process.env.NEXT_PUBLIC_API_URL + "/api/register";

    if (contentType.includes("multipart/form-data")) {
      // Clone request untuk mendapatkan email guna rate limiting
      const clonedRequest = request.clone();
      const formData = await clonedRequest.formData();
      email = formData.get("email") as string;

      if (!email) {
        return NextResponse.json(
          { message: "Email is required" },
          { status: 400 },
        );
      }

      // Cek apakah email sedang dibekukan
      const freezeStatus = checkIsFrozen(email);
      if (freezeStatus.frozen) {
        return NextResponse.json(
          {
            message: `Pendaftaran dibekukan karena terlalu banyak percobaan. Silakan coba lagi dalam ${freezeStatus.remaining} detik.`,
          },
          { status: 429 },
        );
      }

      // PASS-THROUGH: Forward raw body langsung ke backend
      const blob = await request.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const response = await proxyAxios({
        method: "POST",
        url: registerUrl,
        data: buffer,
        headers: {
          "Content-Type": contentType,
          Accept: "application/json",
        },
        validateStatus: () => true,
      });

      if (response.status >= 400) {
        if (email) recordFailure(email);
        return NextResponse.json(response.data, { status: response.status });
      }

      resetLimit(email);
      return NextResponse.json(response.data);
    } else {
      // JSON Handling
      const body = await request.json();
      email = body.email;

      if (!email) {
        return NextResponse.json(
          { message: "Email is required" },
          { status: 400 },
        );
      }

      const freezeStatus = checkIsFrozen(email);
      if (freezeStatus.frozen) {
        return NextResponse.json(
          {
            message: `Pendaftaran dibekukan karena terlalu banyak percobaan. Silakan coba lagi dalam ${freezeStatus.remaining} detik.`,
          },
          { status: 429 },
        );
      }

      const response = await proxyAxios({
        method: "POST",
        url: registerUrl,
        data: body,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        validateStatus: () => true,
      });

      if (response.status >= 400) {
        if (email) recordFailure(email);
        return NextResponse.json(response.data, { status: response.status });
      }

      resetLimit(email);
      return NextResponse.json(response.data);
    }
  } catch (error: any) {
    if (email) {
      recordFailure(email);
    }

    return NextResponse.json(
      { message: error.message || "An error occurred during registration." },
      { status: 500 },
    );
  }
}
