import { NextResponse } from "next/server";
import { logProcessingQueue } from "../../../../utils/queue";

export async function GET() {
  try {
    const jobCounts = await logProcessingQueue.getJobCounts();
    const isPaused = await logProcessingQueue.isPaused();

    return NextResponse.json({
        queue: "log-processing",
        waiting: jobCounts.waiting || 0,
        active: jobCounts.active || 0,
        completed: jobCounts.completed || 0,
        failed: jobCounts.failed || 0,
        delayed: jobCounts.delayed || 0,
        paused: isPaused
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch queue status" },
      { status: 500 }
    );
  }
}
