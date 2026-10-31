import { NextResponse } from "next/server";
import { getLocalCategories } from "@/lib/catalogData";

export async function GET() {
  const categories = getLocalCategories();
  return NextResponse.json({ items: categories });
}
