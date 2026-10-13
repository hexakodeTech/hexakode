import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { verifyAdminAuth } from "@/lib/auth/utils";
import { bulkDeleteBlogs, bulkUpdateBlogStatus } from "@/modules/blog/services/blog.service";
import { BlogStatus } from "@/modules/blog/types/blog";
import { z } from "zod";

const bulkSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
  action: z.enum(["delete", "publish", "draft"]),
});

export async function POST(req: NextRequest) {
  try {
    await verifyAdminAuth();
    const body = await req.json();
    const parsed = bulkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }
    const { ids, action } = parsed.data;
    if (action === "delete") {
      await bulkDeleteBlogs(ids);
    } else {
      await bulkUpdateBlogStatus(ids, action === "publish" ? "PUBLISHED" : "DRAFT");
    }
    try {
      revalidateTag("recent-posts", "max");
      revalidatePath("/", "layout");
    } catch {}
    return NextResponse.json({ success: true, count: ids.length });
  } catch (error) {
    console.error("[POST /api/blog/bulk]", error);
    return NextResponse.json({ success: false, error: "Bulk operation failed" }, { status: 500 });
  }
}
