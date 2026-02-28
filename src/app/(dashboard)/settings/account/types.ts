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

export interface UpdateProfileFormData {
  name: string;
  phone_number: string;
  foto?: File | string | null;
}

export interface ChangePasswordFormData {
  old_password?: string;
  new_password: string;
  confirm_password: string;
}
