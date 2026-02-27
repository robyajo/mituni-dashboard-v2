import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/options/provinsi`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses permintaan" },
      { status: 500 },
    );
  }
}
