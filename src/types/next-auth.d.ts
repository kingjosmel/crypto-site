import "next-auth";
import "next-auth/jwt";
declare module "next-auth" { interface Session { accessToken?: string; user: { id: string; role: "CUSTOMER" | "ADMIN"; email?: string | null; name?: string | null; image?: string | null }; } interface User { accessToken?: string; role: "CUSTOMER" | "ADMIN"; } }
declare module "next-auth/jwt" { interface JWT { apiToken?: string; role?: "CUSTOMER" | "ADMIN"; userId?: string; } }
