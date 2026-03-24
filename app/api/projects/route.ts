import { NextRequest, NextResponse } from "next/server";

const SHEET_API_URL = process.env.GOOGLE_SHEET_API_URL!;

async function fetchGAS(url: string, options?: RequestInit) {
  // First request - don't follow redirect automatically
  const res = await fetch(url, {
    ...options,
    redirect: "manual",
  });

  // Apps Script always redirects (302) - follow with GET
  if (res.status === 302 || res.status === 301) {
    const redirectUrl = res.headers.get("location");
    if (redirectUrl) {
      const finalRes = await fetch(redirectUrl, { redirect: "follow" });
      const text = await finalRes.text();
      try {
        return JSON.parse(text);
      } catch {
        console.error("Failed to parse redirect response:", text.substring(0, 200));
        throw new Error("Invalid JSON from Google Apps Script");
      }
    }
  }

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error("Failed to parse response:", text.substring(0, 200));
    throw new Error("Invalid JSON from Google Apps Script");
  }
}

export async function GET() {
  try {
    const data = await fetchGAS(`${SHEET_API_URL}?action=getAll`, {
      cache: "no-store",
    });
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = JSON.stringify({
      action: "addProject",
      ...body,
    });

    const data = await fetchGAS(SHEET_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: payload,
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      { error: "Failed to add project" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const payload = JSON.stringify({
      action: "updateProject",
      ...body,
    });

    const data = await fetchGAS(SHEET_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: payload,
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const payload = JSON.stringify({
      action: "editProject",
      ...body,
    });

    const data = await fetchGAS(SHEET_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: payload,
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to edit project" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const payload = JSON.stringify({
      action: "deleteProject",
      id: body.id,
    });

    const data = await fetchGAS(SHEET_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: payload,
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
