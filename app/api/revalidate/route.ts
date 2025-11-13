import { getCommerce } from "@/lib/commerce";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const commerce = await getCommerce();
  return commerce.revalidate(req);
}
