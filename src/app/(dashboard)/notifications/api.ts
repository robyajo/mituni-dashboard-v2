import axios from "@/lib/axios";
import {
  NotificationsResponse,
  LatestNotificationsResponse,
  NotificationSummaryResponse,
  NotificationMetaResponse,
  NotificationParams,
} from "./types";

export const NOTIFICATIONS_KEY = ["notifications"];
export const NOTIFICATIONS_LATEST_KEY = ["notifications", "latest"];
export const NOTIFICATIONS_SUMMARY_KEY = ["notifications", "summary"];
export const NOTIFICATIONS_META_KEY = ["notifications", "meta"];

export async function getNotifications(params: NotificationParams) {
  try {
    const response = await axios.post<NotificationsResponse>(
      "/api/notifications",
      params,
      {
        baseURL: "", // Use local proxy
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil data notifikasi",
    );
  }
}

export async function getLatestNotifications() {
  try {
    const response = await axios.post<LatestNotificationsResponse>(
      "/api/notifications/latest",
      {},
      {
        baseURL: "", // Use local proxy
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil notifikasi terbaru",
    );
  }
}

export async function getNotificationSummary() {
  try {
    const response = await axios.post<NotificationSummaryResponse>(
      "/api/notifications/summary",
      {},
      {
        baseURL: "", // Use local proxy
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil ringkasan notifikasi",
    );
  }
}

export async function getNotificationMeta() {
  try {
    const response = await axios.get<NotificationMetaResponse>(
      "/api/notifications/meta",
      {
        baseURL: "", // Use local proxy
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil kategori notifikasi",
    );
  }
}

export async function markNotificationAsRead(id: number) {
  try {
    const response = await axios.post(
      "/api/notifications/mark-read",
      { id },
      {
        baseURL: "", // Use local proxy
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Gagal menandai notifikasi sebagai dibaca",
    );
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const response = await axios.post(
      "/api/notifications/mark-all-read",
      {},
      {
        baseURL: "", // Use local proxy
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Gagal menandai semua notifikasi sebagai dibaca",
    );
  }
}
