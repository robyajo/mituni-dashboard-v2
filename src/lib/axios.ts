import Axios from "axios";
import https from "https";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    // "Content-Type": "application/json", // JANGAN DI-SET DEFAULT! Biarkan Axios/Browser menentukannya (terutama untuk FormData)
  },
  withCredentials: false,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  timeout: 30000,
});

// Request Interceptor: Inject branch_id (outlet_id_active) automatically
axios.interceptors.request.use((config) => {
  // Hanya berjalan di Client Side (Browser)
  if (typeof window !== "undefined") {
    try {
      const storageStr = localStorage.getItem("outlet-storage");
      if (storageStr) {
        const parsed = JSON.parse(storageStr);
        const branchId = parsed.state?.outlet_id_active;

        if (branchId) {
          // Jika data adalah FormData
          if (config.data instanceof FormData) {
            if (!config.data.has("branch_id")) {
              config.data.append("branch_id", String(branchId));
              // console.log("[Axios Interceptor] Injected branch_id to FormData:", branchId);
            }
          } 
          // Jika data adalah JSON object (dan bukan FormData/File)
          else if (config.data && typeof config.data === "object" && !Array.isArray(config.data)) {
             // Pastikan bukan null/undefined
             if (!config.data.branch_id) {
                config.data.branch_id = branchId;
                // console.log("[Axios Interceptor] Injected branch_id to JSON Body:", branchId);
             }
          }
        }
      }
    } catch (error) {
      console.error("[Axios Interceptor] Error injecting branch_id:", error);
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axios;
