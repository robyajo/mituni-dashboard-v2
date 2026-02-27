import axios from "@/lib/axios";

export const PROVINCES_KEY = ["provinces"];
export const CITIES_KEY = ["cities"];

export async function getWilayahProvinces() {
  try {
    const response = await axios.get("/api/optios/provice", {
      baseURL: "",
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil data provinsi",
    );
  }
}

export async function getWilayahCities(provinceId: string | number) {
  try {
    const formData = new FormData();
    formData.append("province_id", String(provinceId));

    const response = await axios.post("/api/optios/city", formData, {
      baseURL: "",
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil data kota",
    );
  }
}
