import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // The first item is the base URL
    const baseUrl = queryKey[0] as string;
    
    // Build URL with query parameters from the rest of queryKey
    const url = new URL(baseUrl, window.location.origin);
    
    // If there are additional parameters (symbol, period, etc.)
    if (queryKey.length > 1) {
      // Add them as query parameters
      if (baseUrl.includes('/api/stocks/quote') && queryKey[1]) {
        url.searchParams.append('symbol', queryKey[1] as string);
      } 
      else if (baseUrl.includes('/api/stocks/history')) {
        if (queryKey[1]) url.searchParams.append('symbol', queryKey[1] as string);
        if (queryKey[2]) url.searchParams.append('period', queryKey[2] as string);
      }
      else if (baseUrl.includes('/api/stocks/key-stats') && queryKey[1]) {
        url.searchParams.append('symbol', queryKey[1] as string);
      }
    }
    
    const res = await fetch(url.toString(), {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
