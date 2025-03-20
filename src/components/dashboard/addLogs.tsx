"use client";
import { FileDataType } from "../../types/ui";
import { handleUpload } from "../../utils/helper";
import React, { useRef, useState } from "react";

const CHUNK_SIZE = 5 * 1024 * 1024;

const AddLogs = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileDataType[]>([]); // Stores file states

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) return;

    // Sort files by size (smallest first)
    selectedFiles.sort((a, b) => a.size - b.size);

    const newFiles = selectedFiles.map((file) => ({
      file,
      fileId:
        Date.now().toString() + Math.random().toString(36).substring(2, 9),
      uploadedChunks: 0,
      progress: 0
    }));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    newFiles.forEach((file) =>
      handleUpload({
        fileData: file,
        chunkIndex: file.uploadedChunks,
        CHUNK_SIZE,
        setFiles,
      })
    );
  };

  return (
    <div>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Add Logs
      </button>
      <input
        type="file"
        accept=".log, .txt, .json"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {files.length > 0 && (
        <div>
          {files.map((file) => (
            <div key={file.fileId}>
              <p>
                {file.file.name} - {file.progress.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddLogs;
