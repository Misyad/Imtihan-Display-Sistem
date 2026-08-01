import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "quran-coords.json");

export async function GET() {
  try {
    const raw = fs.readFileSync(FILE, "utf8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    fs.writeFileSync(FILE, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
