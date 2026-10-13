import { NextResponse } from "next/server";
import { getPublicPortfolioProjects } from "@/modules/portfolio/services/portfolio.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await getPublicPortfolioProjects();
    return NextResponse.json({ success: true, projects });
  } catch (error: unknown) {
    console.error("Public fetch error:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to load public portfolio projects.";
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
