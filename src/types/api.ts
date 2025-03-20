export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface RequestOptions extends RequestInit {
  showToast?: boolean;
  toastMessage?: string;
}
