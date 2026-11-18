
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    // Validate email before forwarding it
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      console.error("GOOGLE_APPS_SCRIPT_URL is not configured.");

      return NextResponse.json(
        {
          success: false,
          message: "Newsletter service is temporarily unavailable.",
        },
        { status: 500 }
      );
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      cache: "no-store",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`Newsletter service returned HTTP ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      const isDuplicate = String(result.message || "")
        .toLowerCase()
        .includes("already subscribed");

      return NextResponse.json(
        {
          success: false,
          message: result.message || "Unable to complete subscription.",
        },
        { status: isDuplicate ? 409 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing to the RefurnishNG newsletter!",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "We couldn't process your subscription. Please try again.",
      },
      { status: 500 }
    );
  }
}
