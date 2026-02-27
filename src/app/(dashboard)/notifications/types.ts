export interface Notification {
  id: number;
  user_id: number;
  branch_id: number | null;
  is_global: boolean;
  category: string;
  title: string;
  body: string;
  is_read: boolean;
  action_type: "screen" | "none" | "transaction_detail" | string;
  action_data: string | null;
  date_value: string;
  date_text: string;
  date_ago: string;
}

export interface NotificationMeta {
  id: number;
  name_kategori: string;
  value_kategori: string;
  deskripsi: string;
  action_type: string;
  payload_desc: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationSummary {
  total: number;
  total_read: number;
  total_unread: number;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: {
    data: Notification[];
    limit: number;
    page: number;
    total_data: number;
    total_page: number;
  };
}

export interface LatestNotificationsResponse {
  success: boolean;
  message: string;
  data: Notification[];
}

export interface NotificationSummaryResponse {
  success: boolean;
  message: string;
  data: NotificationSummary;
}

export interface NotificationMetaResponse {
  success: boolean;
  message: string;
  data: NotificationMeta[];
}

export interface NotificationParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}
