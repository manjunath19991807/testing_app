import axios, { AxiosHeaders } from "axios";
import { env } from "./env";

const sessionStorageKey = "csv-analytics-session";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const session = window.localStorage.getItem(sessionStorageKey);
  const nextHeaders = AxiosHeaders.from(config.headers ?? {});

  if (session) {
    const authSession = JSON.parse(session) as { token?: string };

    if (authSession.token) {
      nextHeaders.set("Authorization", `Bearer ${authSession.token}`);
    }
  }

  config.headers = nextHeaders;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.localStorage.removeItem(sessionStorageKey);
      window.dispatchEvent(new Event("auth:logout"));
    }

    const message =
      error.response?.data?.message ??
      error.message ??
      "Something went wrong while calling the API.";

    return Promise.reject(new Error(message));
  },
);

export async function getJson<T>(path: string): Promise<T> {
  const response = await apiClient.get<T>(path);
  return response.data;
}

export async function postJson<TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const response = await apiClient.post<TResponse>(path, body);
  return response.data;
}

export async function postFormData<TResponse>(
  path: string,
  body: FormData,
): Promise<TResponse> {
  const response = await apiClient.post<TResponse>(path, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
