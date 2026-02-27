import axios from "@/lib/axios";

export const BRANCHES_KEY = ["branches"];
export const PROVINCES_KEY = ["provinces"];
export const CITIES_KEY = ["cities"];

export async function getProvinces() {
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

export async function getCities(provinceId: string | number) {
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

export async function getBranches(params?: { branch_id?: string | number }) {
  try {
    const response = await axios.get("/api/branches", {
      params,
      baseURL: "",
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil data branch",
    );
  }
}

export async function showBranch(params: {
  id: string | number;
  branch_id?: string | number;
}) {
  try {
    // If we are editing a specific branch (id), we should prioritize that.
    // However, if the API requires 'branch_id' to be the TARGET branch ID,
    // then we might be passing the wrong parameter if we pass 'activeBranchId' as 'branch_id'.

    // Based on typical patterns, 'show' usually takes the ID of the resource.
    // If 'branch_id' is for "current active context", it should be separate.

    // Let's check what params contains.
    // If params.id is the branch we want to edit.

    const response = await axios.post("/api/branches/show", params, {
      baseURL: "",
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil detail branch",
    );
  }
}

export async function saveBranch(formData: FormData, mode: "store" | "update") {
  try {
    const endpoint =
      mode === "store" ? "/api/branches/store" : "/api/branches/update";

    const response = await axios.post(endpoint, formData, { baseURL: "" });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        `Gagal ${mode === "store" ? "menambah" : "mengubah"} branch`,
    );
  }
}

export async function deleteBranch(params: {
  id: string | number;
  branch_id?: string | number;
}) {
  try {
    const response = await axios.post("/api/branches/delete", params, {
      baseURL: "",
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Gagal menghapus branch");
  }
}
