import api from "../api";


export const importProducts = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(`/api/products/import`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
