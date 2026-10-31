import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUserAddresses, verifyAuthToken } from "@/lib/catalogData";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tokenUser = await verifyAuthToken(authHeader.replace("Bearer ", ""));
  if (!tokenUser) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const user = getUserById(tokenUser.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    role: user.role,
    emailVerifiedAt: user.emailVerifiedAt,
    addresses: user.addresses
  });
}

export async function PATCH(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tokenUser = await verifyAuthToken(authHeader.replace("Bearer ", ""));
  if (!tokenUser) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const body = await request.json();
  const updated = updateUserAddresses(tokenUser.id, body.addresses || []);
  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: updated.id,
    email: updated.email,
    role: updated.role,
    emailVerifiedAt: updated.emailVerifiedAt,
    addresses: updated.addresses
  });
}
