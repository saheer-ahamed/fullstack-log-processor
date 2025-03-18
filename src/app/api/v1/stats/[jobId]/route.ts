import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/src/utils/supabase/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ jobId: string }>  }) {
  try {
    const supabase = await createClient();
    const { jobId } = await params;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("log_stats")
        .select("*")
        .eq("jobId", jobId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Upload endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
