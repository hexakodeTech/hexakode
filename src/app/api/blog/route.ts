import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { verifyAdminAuth } from "@/lib/auth/utils";
import { getBlogs, createBlog } from "@/modules/blog/services/blog.service";
import { createBlogSchema } from "@/modules/blog/validation/schemas";
import { BlogStatus } from "@/modules/blog/types/blog";

// GET /api/blog — list blogs
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const rawStatus = searchParams.get("status");
    const status = (!rawStatus || rawStatus.toLowerCase() === "all") ? undefined : (rawStatus as BlogStatus);
    const featured = searchParams.get("featured") === "true" ? true : undefined;
    const sort = (searchParams.get("sort") as "newest" | "oldest") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    // Public endpoint — filter to published only when no auth
    let authed = false;
    try { await verifyAdminAuth(); authed = true; } catch {}

    const result = await getBlogs({
      search, category, tag,
      status: authed ? status : "PUBLISHED",
      featured, sort, page, limit,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[GET /api/blog]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// POST /api/blog — create blog (admin only)
export async function POST(req: NextRequest) {
  try {
    await verifyAdminAuth();
    const body = await req.json();
    const parsed = createBlogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }
    const blog = await createBlog(parsed.data as any);
    try {
      revalidateTag("recent-posts", "max");
      revalidatePath("/", "layout");
    } catch {}
    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, error: "A blog with this slug already exists" }, { status: 409 });
    }
    console.error("[POST /api/blog]", error);
    return NextResponse.json({ success: false, error: "Failed to create blog" }, { status: 500 });
  }
}
