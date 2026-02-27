export type SiteConfig = {
  name: string;
  author: string;
  description: string;
  keywords: Array<string>;
  locale: string;
  type: string;
  publishedTime: string;
  twitterCard: string;
  url: {
    base: string;
    author: string;
  };
  links: {
    github: string;
  };
  ogImage: string;
};
export interface BreadcrumbType {
  label: string;
  href: string;
  isCurrent?: boolean;
}

// Dashboard Types
export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface StatItem {
  name: string;
  value: number;
}

export interface ItemDry {
  id: number;
  name: string;
  name_item?: string; // Added based on API response
  branch_id?: number; // Added based on API response
  total_qty?: number;
  total_transaksi?: number;
}

export interface Rack {
  id: number;
  name: string;
  rack_name?: string;
  total_qty: number;
  total_transaksi: number;
}

export interface ExpenseCategory {
  id: number;
  branch_id: number;
  name: string;
  description: string;
}

export interface Perfume {
  id: number;
  name: string;
  name_perfume?: string;
  total_qty: number;
  total_transaksi: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  alamat: string | null;
  total_transaksi: number;
}

export interface DashboardMetaResponse {
  ranges: {
    label: string;
    need_date: boolean;
    value: string;
  }[];
  required_post: string[];
  statuses: {
    color: string;
    label: string;
    value: string;
  }[];
}

export interface TransactionRekapItem {
  label: string;
  value: number;
  value_text: string;
  nominal?: number;
  nominal_text?: string;
}

export interface TransactionGraphData {
  group_by: string;
  data: {
    label: string;
    total_transaksi?: number;
    total_lunas?: number;
    total_belum_lunas?: number;
    nominal_lunas?: number;
    nominal_belum_lunas?: number;
    total_grand_total?: number;
    items?: {
      label: string;
      value: number;
      nominal: number;
      color?: string;
    }[];
  }[];
}

export interface TransactionStatsResponse {
  rekap: TransactionRekapItem[];
  grafik: TransactionGraphData;
}

export interface TransactionStatusItem {
  status: string;
  status_color: string;
  status_name: string;
  total: number;
}

export interface TransactionPaymentResponse {
  rekap: TransactionRekapItem[];
  grafik: TransactionGraphData;
}

export interface TransactionLayananResponse {
  rekap: TransactionRekapItem[];
  grafik: TransactionGraphData;
}

export interface TransactionCustomersResponse {
  rekap: TransactionRekapItem[];
  grafik: TransactionGraphData;
}

export interface TransactionRackResponse {
  rekap: TransactionRekapItem[];
  grafik: TransactionGraphData;
}

export interface TransactionPerfumeResponse {
  rekap: TransactionRekapItem[];
  grafik: TransactionGraphData;
}

// Master
export interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  icon: string;
  icon_url: string;
  branch_id: number;
  unit_id: number;
  unit_name: string;
  unit_type: string;
}

export interface ServiceResponse {
  success: boolean;
  message: string;
  data: {
    data: Service[];
    limit: number;
    page: number;
    total_data: number;
    total_page: number;
  };
}
