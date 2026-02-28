import axios from "@/lib/axios";
import {
  ProfileResponse,
  VerificationResponse,
  ChangePasswordFormData,
} from "./types";

export async function updateProfile(formData: FormData) {
  try {
    const response = await axios.post("/api/account/update", formData, {
      baseURL: "",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Gagal memperbarui profile",
    );
  }
}

export async function changePassword(data: ChangePasswordFormData) {
  try {
    const response = await axios.post("/api/account/change-password", data, {
      baseURL: "",
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Gagal mengubah password");
  }
}
