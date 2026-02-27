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

    let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/profile/check-verified`;

    console.log(`[Profile API Proxy] Forwarding to backend URL: ${apiUrl}`);

    const contentType = request.headers.get("content-type") || "";
    let body: any;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const newFormData = new FormData();

      // Copy all entries from the original FormData
      formData.forEach((value, key) => {
        newFormData.append(key, value);
      });

      console.log(`[Profile API Proxy] Rebuilding FormData:`);

      // Ensure branch_id is present if needed (usually handled by client, but good to check)
      if (!newFormData.has("branch_id") && session.data?.outlet_id_active) {
        newFormData.append("branch_id", String(session.data.outlet_id_active));
      }
      body = newFormData;
    } else {
      // JSON body
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
      console.error(`[Customers API] Error ${response.status}:`, response.data);
      return NextResponse.json(response.data, { status: response.status });
    }

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[Profile API] Error processing request:", error.message);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat memproses permintaan",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
