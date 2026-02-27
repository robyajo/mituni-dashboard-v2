import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

// Instance Axios khusus untuk Proxy Server-to-Server
const proxyAxios = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  timeout: 30000,
});

export async function POST(request: Request) {
  try {
    let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/publik/plans`;

    console.log(`[Plans API Proxy] Forwarding to backend URL: ${apiUrl}`);

    const contentType = request.headers.get("content-type") || "";
    let body: any;

    if (contentType.includes("multipart/form-data")) {
      const newFormData = new FormData();

      console.log(`[Plans API Proxy] Rebuilding FormData:`);

      body = newFormData;
    } else {
      // JSON body
      const clientBody = await request.json().catch(() => ({}));

      const formData = new FormData();
      Object.keys(clientBody).forEach((key) => {
        if (clientBody[key] !== undefined && clientBody[key] !== null) {
          formData.append(key, String(clientBody[key]));
        }
      });

      body = formData;
    }

    const response = await proxyAxios({
      method: "POST",
      url: apiUrl,
      data: body,
      headers: {
        "key-mituni-publik": process.env.NEXT_PUBLIC_API_MITUNI_KEY,
        ...(body instanceof FormData ? (body as any).getHeaders?.() : {}), // Handle headers if server-side FormData
      },
      validateStatus: () => true,
    });

    if (response.status >= 400) {
      console.error(`[Plans API] Error ${response.status}:`, response.data);
      return NextResponse.json(response.data, { status: response.status });
    }

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error processing request:", error.message);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat memproses permintaan",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
