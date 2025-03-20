import { toast } from "react-hot-toast";
import { ToastMessageProps, HandleUploadProps } from "../types/ui";

export const toastMessage = ({ message, type }: ToastMessageProps) => {
  return toast[type](message, { removeDelay: 2000 });
};

export const handleUpload = async ({
  fileData,
  chunkIndex,
  CHUNK_SIZE,
  setFiles,
}: HandleUploadProps) => {
  const { file, fileId } = fileData;

  if (!file) {
    toastMessage({ message: "Please select a file first!", type: "error" });
    return;
  }

  const allowedTypes = [
    "text/plain",
    "application/json",
    "text/csv",
    "text/log",
    "text/x-log",
  ];

  if (!allowedTypes.includes(file.type)) {
    toastMessage({
      message: "Invalid file type. Please select a valid log file.",
      type: "error",
    });
    return;
  }

  const start = chunkIndex * CHUNK_SIZE;
  const end = Math.min(start + CHUNK_SIZE, file.size);
  const chunk = file.slice(start, end);

  const formData = new FormData();
  formData.append("file", chunk);
  formData.append("fileId", fileId);
  formData.append("filename", file.name);
  formData.append("chunkIndex", chunkIndex.toString());
  formData.append("totalChunks", Math.ceil(file.size / CHUNK_SIZE).toString());

  try {
    let response = await fetch("/api/v1/upload-logs", {
      method: "POST",
      body: formData,
    });

    let data = await response.json();

    if (data.status === 200) {
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.fileId === fileId
            ? {
                ...f,
                uploadedChunks: chunkIndex + 1,
                progress:
                  ((chunkIndex + 1) / Math.ceil(file.size / CHUNK_SIZE)) * 100,
              }
            : f
        )
      );
      if (chunkIndex + 1 < Math.ceil(file.size / CHUNK_SIZE)) {
        handleUpload({
          fileData,
          chunkIndex: chunkIndex + 1,
          CHUNK_SIZE,
          setFiles,
        });
      }
    } else {
      setFiles((prevFiles) => prevFiles.filter((f) => f.fileId !== fileId));
      toastMessage({ message: data.error, type: "error" });
    }
  } catch (error) {
    setFiles((prevFiles) => prevFiles.filter((f) => f.fileId !== fileId));
    console.error(`Upload error for ${file.name}:`, error);
  }
};
