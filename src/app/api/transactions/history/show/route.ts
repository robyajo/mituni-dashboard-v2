import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import axios from "axios";
import https from "https";

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

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/show`;
    console.log(`[Transaksi Show Proxy] Forwarding to backend URL: ${apiUrl}`);

    const contentType = request.headers.get("content-type") || "";
    let body: any;

    if (contentType.includes("multipart/form-data")) {
      const newFormData = new FormData();
      // ... logic jika perlu handle multipart (biasanya show cuma kirim ID)
      body = newFormData;
    } else {
      const clientBody = await request.json().catch(() => ({}));
      const formData = new FormData();
      Object.keys(clientBody).forEach((key) => {
        formData.append(key, String(clientBody[key]));
      });
      // Inject branch_id if missing
      if (!formData.has("branch_id") && session.data?.outlet_id_active) {
        formData.append("branch_id", String(session.data.outlet_id_active));
      }
      body = formData;
    }

    const response = await proxyAxios({
      method: "POST",
      url: apiUrl,
      data: body,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      validateStatus: () => true,
    });

    if (response.status >= 400) {
      console.error(
        `[Transaksi Show Proxy] Error ${response.status}:`,
        response.data,
      );
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
