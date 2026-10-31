import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { Category, Product } from "./models/index.js";
import { checkoutRouter } from "./routes/checkout.js";
import { ordersRouter } from "./routes/orders.js";
import { authRouter } from "./routes/auth.js";
import { adminRouter } from "./routes/admin.js";
import { meRouter } from "./routes/me.js";
import { captureApiError } from "./services/sentry.js";

const publicProductFields = "_id name slug brand categoryId condition priceCents currency sku status stockStatus warranty returnPolicy description specs images sizes authenticity createdAt updatedAt";
const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  page: z.coerce.number().int().min(1).optional(),
  cursor: z.string().regex(/^[A-Za-z0-9_-]+$/).optional(),
  category: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  brand: z.string().trim().min(1).max(80).regex(/^[A-Za-z0-9 .&'-]+$/).optional(),
  q: z.string().max(100).refine((value) => !value.includes("$"), "Query contains a forbidden operator").optional(),
  sort: z.enum(["price_asc", "price_desc", "newest", "name"]).default("newest")
}).refine((value) => !(value.page && value.cursor), { message: "Use page or cursor, not both" });

function encodeCursor(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}
function decodeCursor(value: string) {
  const decoded = Number(Buffer.from(value, "base64url").toString("utf8"));
  if (!Number.isInteger(decoded) || decoded < 0) throw new Error("Invalid cursor");
  return decoded;
}

export const app = express();
const allowedOrigins = new Set((process.env.ALLOWED_ORIGINS ?? "http://localhost:3000").split(",").map((origin) => origin.trim()).filter(Boolean));
const trustProxy = process.env.TRUST_PROXY === "true" ? 1 : Number(process.env.TRUST_PROXY ?? 0);
app.set("trust proxy", Number.isInteger(trustProxy) && trustProxy >= 0 ? trustProxy : 0);
app.use(helmet());
app.use(cors({ origin: (origin, callback) => { if (!origin || allowedOrigins.has(origin)) return callback(null, true); return callback(new Error("Origin not allowed")); }, credentials: false, methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization", "X-TOTP-Code", "X-CSRF-Token"] }));
app.use(rateLimit({ windowMs: 15 * 60_000, limit: Number(process.env.PUBLIC_RATE_LIMIT ?? 300), standardHeaders: "draft-8", legacyHeaders: false, message: { error: "Too many requests" } }));
app.use(express.json({ limit: "100kb" }));
app.use((request, response, next) => { if (["GET", "HEAD", "OPTIONS"].includes(request.method) || !request.headers.cookie) return next(); const origin = request.header("origin"); if (!origin || !allowedOrigins.has(origin) || !request.header("x-csrf-token")) return response.status(403).json({ error: "CSRF validation failed" }); return next(); });
app.use("/checkout", checkoutRouter);
app.use("/orders", ordersRouter);
app.use("/auth", rateLimit({ windowMs: 15 * 60_000, limit: Number(process.env.AUTH_RATE_LIMIT ?? 20), standardHeaders: "draft-8", legacyHeaders: false, message: { error: "Too many authentication attempts" } }), authRouter);
app.use("/admin", adminRouter);
app.use("/me", meRouter);

app.get("/products", async (request: Request, response: Response) => {
  const parsed = querySchema.safeParse(request.query);
  if (!parsed.success) return response.status(400).json({ error: "Invalid query parameters", issues: parsed.error.issues });

  const { limit, page, cursor, category, brand, q, sort } = parsed.data;
  const filter: Record<string, unknown> = { status: "ACTIVE" };
  if (category) filter.categoryId = category;
  if (brand) filter.brand = brand;
  if (q) {
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matchingCategories = await Category.find({ $or: [{ name: { $regex: escaped, $options: "i" } }, { slug: { $regex: escaped, $options: "i" } }] }).select("_id").lean();
    filter.$or = [{ $text: { $search: q } }, { categoryId: { $in: matchingCategories.map((item) => item._id) } }];
  }

  const sortBy: Record<string, 1 | -1> = sort === "price_asc" ? { priceCents: 1, _id: 1 } : sort === "price_desc" ? { priceCents: -1, _id: 1 } : sort === "name" ? { name: 1, _id: 1 } : { createdAt: -1, _id: -1 };
  let skip = page ? (page - 1) * limit : 0;
  try { if (cursor) skip = decodeCursor(cursor); } catch { return response.status(400).json({ error: "Invalid cursor" }); }
  const products = await Product.find(filter).select(publicProductFields).sort(sortBy).skip(skip).limit(limit + 1).lean();
  const hasMore = products.length > limit;
  const items = hasMore ? products.slice(0, limit) : products;
  const nextCursor = hasMore ? encodeCursor(String(skip + items.length)) : null;
  return response.json({ items, pagination: { limit, page: page ?? null, nextCursor, hasMore } });
});

app.get("/products/:slug", async (request: Request, response: Response) => {
  const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).safeParse(request.params.slug);
  if (!slug.success) return response.status(400).json({ error: "Invalid product slug" });
  const product = await Product.findOne({ slug: slug.data, status: "ACTIVE" }).select(publicProductFields).lean();
  if (!product) return response.status(404).json({ error: "Product not found" });
  return response.json(product);
});

app.get("/categories", async (_request: Request, response: Response) => {
  const categories = await Category.find({}).select("_id name slug description createdAt updatedAt").sort({ name: 1 }).lean();
  return response.json({ items: categories });
});

app.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
  void next;
  captureApiError(error);
  return response.status(500).json({ error: "Internal server error" });
});
