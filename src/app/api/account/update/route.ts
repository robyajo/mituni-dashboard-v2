import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import axios from "axios";
import https from "https";

const proxyAxios = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  timeout: 60000,
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/profile/update`;
    console.log(`[Account Update Proxy] Forwarding to backend URL: ${apiUrl}`);

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const blob = await request.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log(
        `[Account Update Proxy] Forwarding multipart body (${buffer.length} bytes) directly.`,
      );

      const response = await proxyAxios({
        method: "POST",
        url: apiUrl,
        data: buffer,
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": contentType,
          Accept: "application/json",
        },
        validateStatus: () => true,
      });

      if (response.status >= 400) {
        console.error(
          `[Account Update Proxy] Error ${response.status}:`,
          response.data,
        );
        return NextResponse.json(response.data, { status: response.status });
      }

      return NextResponse.json(response.data);
    } else {
      const clientBody = await request.json().catch(() => ({}));
      console.log(`[Account Update Proxy] Forwarding JSON body`);

      const response = await proxyAxios({
        method: "POST",
        url: apiUrl,
        data: clientBody,
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        validateStatus: () => true,
      });

      if (response.status >= 400) {
        console.error(
          `[Account Update Proxy] Error ${response.status}:`,
          response.data,
        );
        return NextResponse.json(response.data, { status: response.status });
      }

      return NextResponse.json(response.data);
    }
  } catch (error: any) {
    console.error(
      "[Account Update Proxy] Error processing request:",
      error.message,
    );
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat memproses permintaan",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
