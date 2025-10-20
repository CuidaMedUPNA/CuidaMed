/**
 * Configuration for the API client
 * In production, this will use Heroku
 * In development, you can override this
 */

export const getApiBaseUrl = (): string => {
  // For mobile/production, use Heroku
  // For development, use localhost
  if (typeof window === "undefined") {
    // Server-side
    return process.env.API_URL || "https://cuidamed.herokuapp.com";
  }

  // Client-side
  const isDevelopment = process.env.NODE_ENV === "development";
  if (isDevelopment && typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:3000";
  }

  return process.env.API_URL || "https://cuidamed.herokuapp.com";
};
