// src/api/client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5000", // your backend base URL
  timeout: 5000,                    // 5 seconds timeout (optional)
});

// optional: you can add interceptors later if needed
// apiClient.interceptors.request.use((config) => {
//   // e.g. attach auth token here
//   return config;
// });
