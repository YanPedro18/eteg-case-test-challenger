import axios from "axios";
import type { ApiResponse, CustomerResponse, CreateCustomerDTO } from "@john-doe/shared";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  headers: { "Content-Type": "application/json" },
});

export type ColorOption = { value: string; label: string };

export async function fetchColors(): Promise<ColorOption[]> {
  const { data } = await api.get<ApiResponse<ColorOption[]>>("/colors");
  if (!data.success) throw new Error("Falha ao carregar cores");
  return data.data;
}

export async function registerCustomer(
  payload: CreateCustomerDTO
): Promise<CustomerResponse> {
  try {
    const { data } = await api.post<ApiResponse<CustomerResponse>>(
      "/customers",
      payload
    );
    if (!data.success) throw new Error(data.error);
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const apiError = error.response.data as ApiResponse<never>;
      if (!apiError.success) {
        throw new ApiError(apiError.error, apiError.details);
      }
    }
    throw error;
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}
