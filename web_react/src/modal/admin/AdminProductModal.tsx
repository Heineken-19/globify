import { useState, useEffect } from "react";
import { Modal, TextInput, Textarea, NumberInput, Button, FileInput, Select, Switch } from "@mantine/core";
import type { AdminProduct } from "../../types";
import { useCreateProduct, useUpdateProduct, useCategories} from "../../hooks/admin/useAdminProduct";
import { AdminProductModalProps } from "../../types";

const AdminProductModal = ({ opened, onClose, product }: AdminProductModalProps) => {
  const isEditing = !!product;

  const { data: categories, isLoading } = useCategories();
  const { mutateAsync: createProduct } = useCreateProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [originalData, setOriginalData] = useState<Partial<AdminProduct>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Partial<AdminProduct>>({
    id: undefined, // 🔹 Az id most már mindig benne van
    name: "",
    title: "",
    size: "",
    type: "",
    description: "",
    price: 0,
    stock: 0,
    available: true,
    category: { id: 0 },
  });


  useEffect(() => {
    if (product) {
      setFormData({ ...product, category: product.category || { id: 0 }, }); // 🔹 Termék adatok betöltése szerkesztéskor
      setOriginalData({ ...product }); // 🔹 Mentjük az eredeti adatokat
    } else {
      resetForm();
    }
  }, [product, categories]);

  const resetForm = () => {
    setFormData({
      id: undefined,
      name: "",
      title: "",
      size: "",
      type: "",
      description: "",
      price: 0,
      stock: 0,
      category: { id: 0 },
      available: true,
    });
    setSelectedFiles([]);
    setOriginalData({});
    setErrors({});
  };


  const getUpdatedFields = (): Partial<AdminProduct> => {
    let updatedFields: Partial<AdminProduct> = { ...originalData };

    for (const key in formData) {
      const typedKey = key as keyof AdminProduct;
      const newValue = formData[typedKey];

      if (newValue !== undefined && newValue !== originalData[typedKey]) {
        updatedFields = {
          ...updatedFields,
          [typedKey]: newValue,
        };
      }

      if (!("available" in updatedFields)) {
        updatedFields["available"] = formData.available ?? true;
      }
    }

    return updatedFields;
  };


  

  // ✅ Hibakezelés frissítése komponensekhez
  const handleValidationError = (error: any) => {
    if (error.response?.data?.errors) {
      const backendErrors: Record<string, string> = {};

      error.response.data.errors.forEach((err: any) => {
        backendErrors[err.field] = err.message;
      });

      setErrors(backendErrors);
    }
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    const updatedFields = getUpdatedFields();

    if (!formData.name) {
      setErrors((prev) => ({ ...prev, name: "A név kötelező!" }));
      return;
    }

    if (!formData.category?.id) {
      setErrors((prev) => ({ ...prev, category: "A kategória kiválasztása kötelező!" }));
      return;
    }

    try {
      setErrors({});
      formDataToSend.append("product", JSON.stringify(updatedFields));
      selectedFiles.forEach((file) => formDataToSend.append("files", file));

      if (isEditing && formData.id !== undefined) {
        await updateProduct({ id: formData.id, product: formDataToSend });
      } else {
        await createProduct(formDataToSend);
      }

      resetForm();
      onClose();
    } catch (error) {
      handleValidationError(error);
    }
  };


  return (
    <Modal opened={opened} onClose={onClose} title={isEditing ? "Termék szerkesztése" : "Termék hozzáadása"} centered>
      <Switch
        label="Elérhető"
        checked={formData.available}
        onChange={(event) => setFormData({ ...formData, available: event.currentTarget.checked })}
      />
      <TextInput label="Név" value={formData.name} error={errors.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      <TextInput label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
      <Textarea label="Leírás" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
      <NumberInput label="Ár (Ft)" value={formData.price} onChange={(value) => setFormData({ ...formData, price: Number(value) || 0 })} />
      <NumberInput label="Raktárkészlet" value={formData.stock} onChange={(value) => setFormData({ ...formData, stock: Number(value) || 0 })} />
      <TextInput label="Méret" value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} />
      <TextInput label="Típus" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />

      <Select
        label="Kategória"
        placeholder={isLoading ? "Betöltés..." : "Válassz kategóriát"}
        data={categories?.map((cat) => ({ value: cat.id.toString(), label: cat.name })) || []}
        value={formData.category?.id ? formData.category.id.toString() : undefined}
        error={errors.category}
        onChange={(value) => setFormData({ ...formData, category: { id: Number(value) } })}
      />



      <FileInput
        multiple
        label="Termék képek"
        placeholder="Képek feltöltése"
        onChange={(files) => setSelectedFiles(files as File[])}
      />
      {errors.general && <div style={{ color: "red", marginTop: "10px" }}>{errors.general}</div>}
      <Button onClick={handleSubmit} fullWidth mt="md">
        {isEditing ? "Frissítés" : "Hozzáadás"}
      </Button>
    </Modal>
  );
};

export default AdminProductModal;
