import * as React from "react";
import axios from "axios";
export interface ProfileData {
  name: string;
  email: string;
  phone_number: string;
  role: string;
  foto: string;
  photo_url: string;
}

export interface VerificationData {
  role: string;
  email: string;
  phone_number: string;
  is_verified: boolean;
  is_verified_label: string;
  wa_verified_at: string | null;
  email_verified_at: string | null;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: ProfileData;
}
export interface VerificationResponse {
  success: boolean;
  message: string;
  data: VerificationData;
}

export const PROFILE_KEY = ["profile"];
export const VERIFICATION_KEY = ["verification"];

export async function getProfile() {
  try {
    const response = await axios.post<ProfileResponse>(
      "/api/account",
      {},
      {
        baseURL: "",
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil data profile",
    );
  }
}

export async function getVerificationStatus() {
  try {
    const response = await axios.post<VerificationResponse>(
      "/api/account/check-verified",
      {},
      {
        baseURL: "",
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil status verifikasi",
    );
  }
}
