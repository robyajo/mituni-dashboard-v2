import * as React from "react";
import axios from "axios";
export interface MembershipSubscriptionsData {
  id: number;
  plan_id: number;
  plan_name: string;
  start_date: string;
  end_date: string;
  is_trial: boolean;
  status: string;
  is_active: boolean;
  tier: string;
  is_pro_active: boolean;
}
export interface MembershipSubscriptionsResponse {
  success: boolean;
  message: string;
  data: MembershipSubscriptionsData;
}

export const MEMBERSHIP_SUBSCRIPTIONS_KEY = [
  "account-membership-subscriptions",
];

export async function getMembershipSubscriptions() {
  try {
    const response = await axios.post<MembershipSubscriptionsResponse>(
      "/api/membership/subscriptions",
      {},
      {
        baseURL: "",
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil data subscriptions",
    );
  }
}
