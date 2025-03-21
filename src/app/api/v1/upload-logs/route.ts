import { NextResponse, type NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { logProcessingQueue } from "../../../../utils/queue";
import { createClient } from "@supabase/supabase-js";
import {v4 as uuidv4 } from "uuid"

const TEMP_DIR = path.join(process.cwd(), "public/temp");
const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB default

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;
    const filename = formData.get("filename") as string;
    const chunkIndex = Number(formData.get("chunkIndex"));
    const totalChunks = Number(formData.get("totalChunks"));

    if (!file || !filename) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Check file size limit
    const maxFileSize = parseInt(
      process.env.MAX_FILE_SIZE || DEFAULT_MAX_FILE_SIZE.toString()
    );
    if (file.size > maxFileSize) {
      return NextResponse.json(
        {
          error: `File chunk size exceeds the maximum limit of ${
            maxFileSize / (1024 * 1024)
          }MB`,
        },
        { status: 400 }
      );
    }

    // Ensure the uploads directory exists
    if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

    // Temporary chunk file path
    const tempFilePath = path.join(TEMP_DIR, `${filename}.part${chunkIndex}`);

    // Save chunk to disk
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(tempFilePath, fileBuffer);

    // Check if all chunks have been uploaded
    if (chunkIndex + 1 === totalChunks) {
      const finalFilePath = path.join(TEMP_DIR, filename);
      const writeStream = fs.createWriteStream(finalFilePath);

      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(TEMP_DIR, `${filename}.part${i}`);
        if (!fs.existsSync(chunkPath)) {
          return NextResponse.json(
            { error: `Missing chunk ${i}` },
            { status: 400 }
          );
        }
        const chunkBuffer = fs.readFileSync(chunkPath);
        writeStream.write(chunkBuffer);
        fs.unlinkSync(chunkPath); // Remove chunk after merging
      }

      writeStream.end();

      // Wait for the stream to finish
      await new Promise((resolve) =>
        writeStream.on("finish", () => resolve(true))
      );

      // Upload to Supabase Storage
      const fileData = fs.readFileSync(finalFilePath);

      const supabaseServerClient = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const fileExtension = filename.split(".").pop(); // Extract file extension
      const fileNameWithoutExt = filename.replace(`.${fileExtension}`, ""); // Filename without extension
      let supabasePath = `${filename}`;
      let counter = 1;

      // Check if the file already exists
      const { data, error } = await supabaseServerClient.storage
        .from("logs")
        .list(userId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Check if the file already exists
      const existingFiles = data.map((file) => file.name);

      while (existingFiles.includes(supabasePath)) {
        supabasePath = `${fileNameWithoutExt} (${counter}).${fileExtension}`;
        counter++;
      }

      supabasePath = `${userId}/${supabasePath}`;

      const { error: uploadError } =
        await supabaseServerClient.storage
          .from("logs")
          .upload(supabasePath, fileData);

      // Remove the merged file after upload
      fs.unlinkSync(finalFilePath);

      if (uploadError) {
        return NextResponse.json(
          {
            error:
              "Failed to upload to Supabase. " + (uploadError.message || ""),
          },
          { status: 500 }
        );
      }

      // ✅ Enqueue log processing job
      const job = await logProcessingQueue.add("process-log", {
        fileId: Date.now().toString(),
        filePath: supabasePath,
        filename: supabasePath,
        userId,
      }, {
        jobId: uuidv4(),
      });

      return NextResponse.json({
        jobId: job.id,
        message: "File uploaded and job enqueued",
        status: 200,
      });
    }

    return NextResponse.json({ message: "Chunk received", status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
