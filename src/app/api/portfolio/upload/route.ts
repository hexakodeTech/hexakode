import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/modules/portfolio/lib/supabaseAdmin";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/modules/portfolio/validation/schemas";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const slug = formData.get("slug") as string | null;
    const type = formData.get("type") as "cover" | "gallery" | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided." }, { status: 400 });
    }
    if (!slug) {
      return NextResponse.json({ success: false, error: "Project slug is required for uploads." }, { status: 400 });
    }
    if (type !== "cover" && type !== "gallery") {
      return NextResponse.json({ success: false, error: "Invalid upload directory type." }, { status: 400 });
    }

    // 1. Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." },
        { status: 400 }
      );
    }

    // 2. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File is too large. Max size allowed is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` },
        { status: 400 }
      );
    }

    // 3. Upload file to Supabase Storage
    const supabase = createSupabaseAdminClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse extension
    let ext = "jpg";
    if (file.type === "image/png") ext = "png";
    if (file.type === "image/webp") ext = "webp";

    // Generate unique UUID name
    const filename = `${crypto.randomUUID()}.${ext}`;
    const path = `portfolio/${slug}/${type}/${filename}`;

    const { error } = await supabase.storage
      .from("portfolio-assets")
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // 4. Retrieve and return public URL
    const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(path);

    if (!data?.publicUrl) {
      throw new Error("Failed to generate public URL.");
    }

    return NextResponse.json({
      success: true,
      url: data.publicUrl,
    });
  } catch (error: unknown) {
    console.error("API Upload error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to upload image to Supabase Storage.";
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
