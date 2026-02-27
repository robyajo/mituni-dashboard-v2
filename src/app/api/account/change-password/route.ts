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

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/profile/change-password`;
    console.log(
      `[Profile Change Password Proxy] Forwarding to backend URL: ${apiUrl}`,
    );

    const clientBody = await request.json().catch(() => ({}));

    // The backend expects: id, new_password, confirm_password
    // We send it as JSON or FormData depending on backend requirement.
    // Based on other routes, let's try JSON first as default for simple data.
    // But other routes use FormData for "store" and "update".
    // Let's stick to FormData to be safe/consistent with this project's pattern if usually they send FormData.
    // However, change-password usually is JSON.
    // Let's look at `store` route again. It supports both.
    // Let's send JSON as it is cleaner, if it fails we can switch.

    // Actually, looking at `users/route.ts` (List), it converts JSON to FormData.
    // Let's follow the pattern in `users/route.ts` just in case the backend is strict about FormData.

    const formData = new FormData();
    Object.keys(clientBody).forEach((key) => {
      formData.append(key, String(clientBody[key]));
    });

    const response = await proxyAxios({
      method: "POST",
      url: apiUrl,
      data: formData,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        // Axios with FormData automatically sets Content-Type to multipart/form-data
      },
      validateStatus: () => true,
    });

    if (response.status >= 400) {
      console.error(
        `[Profile Change Password Proxy] Error ${response.status}:`,
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
