export interface Branch {
  id: number;
  owner_id: number;
  name_brand: string;
  email_brand: string;
  phone_number_brand: string;
  address: string;
  kota: string;
  provinsi: string;
  logo: string;
  provinsi_name?: string;
  kota_name?: string;
  logo_url?: string;
}

export interface Province {
  id: string | number;
  name: string;
}

export interface City {
  id: string | number;
  name: string;
  province_id: string | number;
}
