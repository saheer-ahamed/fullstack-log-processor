import { Worker, Job } from "bullmq";
import { Redis } from "ioredis";
import fs from "fs";
import path from "path";
import readline from "readline";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Redis connection configuration
const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: null,
});

// Ensure temp directory exists
const TEMP_DIR = path.join(process.cwd(), "public/downloads");
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Configure log keywords
const LOG_KEYWORDS = process.env.KEYWORDS?.split(",") || [
  "ERROR",
  "FAIL",
  "WARN",
  "INFO",
];

// Update processing status and notify clients
const updateProcessingStatus = async (
  jobId: string,
  status: string,
  userId: string
) => {
  try {
    await supabase
      .from("log_stats")
      .update({ processingStatus: status })
      .eq("userId", userId)
      .eq("jobId", jobId);

    let result = await supabase
      .from("log_stats")
      .select("*")
      .eq("userId", userId)
      .eq("jobId", jobId);

    await redisConnection.publish(
      "job-progress-channel",
      JSON.stringify({ result })
    );
  } catch (error) {
    console.error(`Failed to update status for job ${jobId}:`, error);
  }
};

let localFileDirectory: string;
let localFilePath: string;

// // Initialize worker
const logWorker = new Worker(
  "log-processing",
  async (job: Job) => {
    const { id: jobId } = job;
    const { fileId, filePath, filename, userId } = job.data;

    if (!jobId) {
      throw new Error("Job ID is not found");
    }

    if (!userId) {
      throw new Error("User ID is not found in job data");
    }

    console.log(`Processing log file: ${filename} for user: ${userId}`);

    try {
      // Download file from Supabase
      const { data, error } = await supabase.storage
        .from("logs")
        .download(filePath);

      if (error) {
        throw new Error(`Failed to download log file: ${error.message}`);
      }

      localFileDirectory = path.join(TEMP_DIR, `${userId}`);
      localFilePath = path.join(TEMP_DIR, filename);

      if (!fs.existsSync(localFileDirectory)) {
        fs.mkdirSync(localFileDirectory, { recursive: true });
      }

      fs.writeFileSync(localFilePath, Buffer.from(await data.arrayBuffer()));

      // Process file
      const fileStream = fs.createReadStream(localFilePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      let errorCount = 0;
      let keywordCounts: Record<string, number> = {};
      let uniqueIPs = new Set<string>();

      for await (const line of rl) {
        LOG_KEYWORDS.forEach((keyword) => {
          if (line.includes(keyword)) {
            keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
          }
        });

        const ipMatch = line.match(/"ip": ?"([^"]+)"/);
        if (ipMatch) uniqueIPs.add(ipMatch[1]);

        if (line.includes("ERROR")) errorCount++;
      }

      // Clean up temp file
      fs.unlinkSync(localFilePath);

      // Store results in Supabase
      const { error: insertError } = await supabase.from("log_stats").insert([
        {
          userId,
          jobId,
          filename,
          errorCount,
          keywordCounts,
          uniqueIPs: Array.from(uniqueIPs),
          processedAt: new Date().toISOString(),
          processingStatus: "processing",
        },
      ]);

      if (insertError) {
        throw new Error(`Failed to insert log stats: ${insertError.message}`);
      }

      await updateProcessingStatus(jobId, "completed", userId);
      console.log(`Successfully processed log file: ${filename}`);
    } catch (error) {
      console.error(`❌ Error processing job ${jobId}:`, error);
      await updateProcessingStatus(jobId, "failed", userId);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: parseInt(process.env.MAX_CONCURRENT_JOBS || "4"),
  }
);

// Handle worker events
logWorker.on("failed", async (job, err) => {
  if (!job?.id) {
    console.error("Job failed without an ID");
    return;
  }

  console.error(`❌ Job ${job.id} failed:`, err);
  await updateProcessingStatus(job.id, "Failed", "");
});

logWorker.on("error", (err) => {
  console.error("Worker error:", err);
});

logWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

// Start the worker
console.log("Log processing worker initialized");
