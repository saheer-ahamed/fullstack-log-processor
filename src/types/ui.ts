export interface LoginFormValues {
  email: string;
  password: string;
  globalError?: string;
}

export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  globalError?: string;
}

export interface ToastMessageProps {
  message: string;
  type: "success" | "error";
}

export interface FileDataType {
  file: File;
  fileId: string;
  uploadedChunks: number;
  progress: number;
}

export interface HandleUploadProps {
  fileData: FileDataType;
  chunkIndex: number;
  CHUNK_SIZE: number;
  setFiles: React.Dispatch<React.SetStateAction<FileDataType[]>>;
}

export interface LogStats {
  jobId: string;
  filename: string;
  errorCount: number;
  keywordCounts: Record<string, number>;
  uniqueIPs: string[];
  processedAt: string;
  processingStatus: string;
}

export interface PaginationComponentProps {
  list: any[];
  currentPage: number;
  totalPage: number;
  rowsLimit: number;
  previousPage: () => void;
  nextPage: () => void;
  changePage: (page: number) => void;
  customPagination: number[];
}
