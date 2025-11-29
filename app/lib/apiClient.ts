// lib/apiClient.ts
"use client";

let accessToken: string | null = null;
let refreshTokenPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

async function refreshAccessToken(): Promise<string | null> {
  // Prevent multiple simultaneous refresh requests
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = fetch("/api/auth/refresh", {
    method: "POST",
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }
      const data = await response.json();
      accessToken = data.accessToken;
      return data.accessToken;
    })
    .catch((error) => {
      console.error("Token refresh failed:", error);
      accessToken = null;
      return null;
    })
    .finally(() => {
      refreshTokenPromise = null;
    });

  return refreshTokenPromise;
}

interface ApiClientOptions extends RequestInit {
  headers?: HeadersInit;
}

export async function apiClient(
  url: string,
  options: ApiClientOptions = {}
): Promise<Response> {
  // Build headers using Headers constructor
  const requestHeaders = new Headers(options.headers || {});

  // Set content type if not already set
  if (!requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  // Add authorization token if available
  if (accessToken) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  // Make the request
  let response = await fetch(url, {
    ...options,
    headers: requestHeaders,
  });

  // If we get a 401, try to refresh the token and retry
  if (response.status === 401 && accessToken) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      requestHeaders.set("Authorization", `Bearer ${newToken}`);
      response = await fetch(url, {
        ...options,
        headers: requestHeaders,
      });
    } else {
      // Redirect to login if refresh fails
      window.location.href = "/login";
    }
  }

  return response;
}

// Convenience methods
export const api = {
  get: (url: string, options?: ApiClientOptions) =>
    apiClient(url, { ...options, method: "GET" }),

  post: (url: string, data?: unknown, options?: ApiClientOptions) =>
    apiClient(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (url: string, data?: unknown, options?: ApiClientOptions) =>
    apiClient(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (url: string, options?: ApiClientOptions) =>
    apiClient(url, { ...options, method: "DELETE" }),
};
