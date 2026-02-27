import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
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
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/branches/delete`;
    console.log(`[Branch Delete Proxy] Forwarding to backend URL: ${apiUrl}`);

    const clientBody = await request.json().catch(() => ({}));
    const branchId = clientBody.id;

    if (!branchId) {
      return NextResponse.json(
        { error: "ID branch wajib dikirim" },
        { status: 422 },
      );
    }

    // Gunakan URLSearchParams untuk mengirim data sebagai x-www-form-urlencoded
    const searchParams = new URLSearchParams();
    searchParams.append("id", String(branchId));

    // Tambahkan _method=DELETE agar Laravel/Framework lain menganggap ini DELETE request
    // meskipun dikirim via POST (method spoofing standard)
    searchParams.append("_method", "DELETE");

    console.log(
      "[Branch Delete Proxy] Forwarding params:",
      searchParams.toString(),
    );

    const response = await proxyAxios({
      method: "POST",
      url: apiUrl,
      data: searchParams,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      validateStatus: () => true,
    });

    if (response.status >= 400) {
      console.error(
        `[Branch Delete Proxy] Error ${response.status}:`,
        response.data,
      );
      return NextResponse.json(response.data, { status: response.status });
    }

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      "[Branch Delete Proxy] Error processing request:",
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
