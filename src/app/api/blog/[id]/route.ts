import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { verifyAdminAuth } from "@/lib/auth/utils";
import { getBlogById, updateBlog, deleteBlog, duplicateBlog } from "@/modules/blog/services/blog.service";
import { updateBlogSchema } from "@/modules/blog/validation/schemas";
import { BlogStatus } from "@/modules/blog/types/blog";

interface Params { params: Promise<{ id: string }> }

// GET /api/blog/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await verifyAdminAuth();
    const { id } = await params;
    const blog = await getBlogById(id);
    if (!blog) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, blog });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
}

// PATCH /api/blog/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await verifyAdminAuth();
    const { id } = await params;
    const body = await req.json();
    const parsed = updateBlogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }
    const blog = await updateBlog(id, parsed.data as any);
    try {
      revalidateTag("recent-posts", "max");
      revalidatePath("/", "layout");
    } catch {}
    return NextResponse.json({ success: true, blog });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, error: "A blog with this slug already exists" }, { status: 409 });
    }
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }
    console.error("[PATCH /api/blog/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to update blog" }, { status: 500 });
  }
}

// DELETE /api/blog/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await verifyAdminAuth();
    const { id } = await params;
    await deleteBlog(id);
    try {
      revalidateTag("recent-posts", "max");
      revalidatePath("/", "layout");
    } catch {}
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }
    console.error("[DELETE /api/blog/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to delete blog" }, { status: 500 });
  }
}
