import { NextRequest, NextResponse } from "next/server";
import { getLocalProducts } from "@/lib/catalogData";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const brand = searchParams.get("brand") || undefined;
  const q = searchParams.get("q") || undefined;
  const sort = (searchParams.get("sort") as "price_asc" | "price_desc" | "newest" | "name") || "newest";
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 20;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const result = getLocalProducts({ category, brand, q, sort, limit, page });
  return NextResponse.json(result);
}
