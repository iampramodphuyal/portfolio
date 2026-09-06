import { NextRequest, NextResponse } from "next/server";
import { resolveGeo } from "@/util/geo";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const geo = await resolveGeo(request.headers);
  return NextResponse.json(geo, { headers: { "Cache-Control": "private, no-store" } });
}
