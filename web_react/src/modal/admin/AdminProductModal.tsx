import { useState, useEffect } from "react";
import { Modal, TextInput, Textarea, NumberInput, Button, FileInput, Select, Switch, SimpleGrid } from "@mantine/core";
import type { AdminProduct } from "../../types";
import { useCreateProduct, useUpdateProduct, useCategories } from "../../hooks/admin/useAdminProduct";
import { AdminProductModalProps } from "../../types";
import { useMediaQuery } from '@mantine/hooks';
import { useModal } from "../../context/ModalContext";

const AdminProductModal = ({ opened, onClose, product }: AdminProductModalProps) => {
  const isEditing = !!product;
  const [light, setLight] = useState("");
  const [water, setWater] = useState("");
  const [extra, setExtra] = useState("");
  const [fact, setFact] = useState("");
  const { data: categories, isLoading } = useCategories();
  const { mutateAsync: createProduct } = useCreateProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [originalData, setOriginalData] = useState<Partial<AdminProduct>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setModalOpen } = useModal();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [discountPercentage, setDiscountPercentage] = useState<number | undefined>(undefined);



  const [formData, setFormData] = useState<Partial<AdminProduct & { category: { id: number; name?: string }, mainSize?: number }>>({
    id: undefined, 
    name: "",
    title: "",
    size: "",
    type: "",
    description: "",
    price: 0,
    stock: 0,
    available: true,
    isNew: true,
    isSale: false,
    mainSize: undefined,
    category: { id: 0 },
  });

  useEffect(() => {
    setModalOpen(opened); 
  }, [opened]);

  useEffect(() => {
    if (product && categories) {
      let selectedCategory;

      
      if (typeof (product.category as any) === "string") {
        selectedCategory = categories.find((cat) => cat.name === product.category);
      } else {
        selectedCategory = categories.find((cat) => cat.id === (product.category as any)?.id);
      }

      setFormData({
        ...product,
        category: selectedCategory
          ? { id: selectedCategory.id, name: selectedCategory.name }
          : { id: 0 },
      });

      setLight(product.light || "");
      setWater(product.water || "");
      setExtra(product.extra || "");
      setFact(product.fact || "");
      setDiscountPercentage(product.discountPercentage ?? undefined);
      setOriginalData({ ...product });
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
      mainSize: undefined,
      category: { id: 0 },
      available: true,
      isNew: true,
      isSale: false,
    });
    setSelectedFiles([]);
    setOriginalData({});
    setErrors({});
    setLight("");   
    setWater("");
    setExtra("");
    setFact("");
    setDiscountPercentage(undefined);
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

      if (!("isSale" in updatedFields)) {
        updatedFields["isSale"] = formData.isSale ?? true;
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
    const updatedFields = { ...formData };

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

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => formDataToSend.append("files", file));
      }

      formDataToSend.append("light", light || "");
      formDataToSend.append("water", water || "");
      formDataToSend.append("extra", extra || "");
      formDataToSend.append("fact", fact || "");

      if (formData.isSale && discountPercentage !== undefined) {
        formDataToSend.append("discountPercentage", String(discountPercentage));
      }

      if (isEditing && formData.id !== undefined) {
        await updateProduct({ id: formData.id, product: formDataToSend });
      } else {
        await createProduct(formDataToSend);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <Modal opened={opened} onClose={onClose} title={isEditing ? "Termék szerkesztése" : "Termék hozzáadása"}
      styles={{
        content: {
          position: isMobile ? 'fixed' : 'fixed',
          bottom: isMobile ? '40px' : '50px',
          width: isMobile ? "45vh" : "70vh",
          maxHeight: isMobile ? "80vh" : "auto",
          overflowY: isMobile ? "auto" : "visible",
          paddingRight: isMobile ? 3 : undefined,
        },
      }}
    >
      <SimpleGrid cols={isMobile ? 1 : 2} spacing="md" verticalSpacing="sm">
        {/* Bal oldal */}
        <div>
          <Switch label="Elérhető" checked={formData.available ?? true} onChange={(event) => setFormData({ ...formData, available: event.currentTarget.checked })} />
          <Switch mt={2} label="Új termék" checked={formData.isNew} onChange={(event) => setFormData({ ...formData, isNew: event.currentTarget.checked })} />
          <Switch mt={2} label="Akciós termék" checked={formData.isSale} onChange={(event) => setFormData({ ...formData, isSale: event.currentTarget.checked })} />
            {formData.isSale && (
            <NumberInput
              label="Kedvezmény (%)"
              value={discountPercentage}
              onChange={(value) => setDiscountPercentage(value ? Number(value) : undefined)}
              min={0}
              max={100}
            />
          )}
          <TextInput label="Név" value={formData.name} error={errors.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <TextInput label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <Textarea label="Leírás" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <NumberInput label="Ár (Ft)" value={formData.price} onChange={(value) => setFormData({ ...formData, price: Number(value) || 0 })} />
          <NumberInput label="Raktárkészlet" value={formData.stock} onChange={(value) => setFormData({ ...formData, stock: Number(value) || 0 })} />
          <FileInput
            multiple
            label="Termék képek"
            placeholder="Képek feltöltése"
            value={selectedFiles.length > 0 ? selectedFiles : undefined}
            onChange={(files) => setSelectedFiles(files as File[])}
          />
        </div>

        {/* Jobb oldal */}
        <div>
          <TextInput label="Paraméterek" value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} />
          <NumberInput label="Szűrési méret (mainSize)" value={formData.mainSize} onChange={(value) => setFormData({ ...formData, mainSize: typeof value === "number" ? value : undefined })} />
          <TextInput label="Típus" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
          <Select
            label="Kategória"
            placeholder={isLoading ? "Betöltés..." : "Válassz kategóriát"}
            data={categories?.map((cat) => ({ value: String(cat.id), label: cat.name })) || []}
            value={formData.category?.id ? String(formData.category.id) : ""}
            error={errors.category}
            onChange={(value) => {
              const selectedId = Number(value);
              const selectedCategory = categories?.find((cat) => cat.id === selectedId);
              setFormData({ ...formData, category: { id: selectedId, name: selectedCategory?.name || "" } });
            }}
          />
          <TextInput label="Fényigény" value={light} onChange={(e) => setLight(e.currentTarget.value)} />
          <TextInput label="Vízigény" value={water} onChange={(e) => setWater(e.currentTarget.value)} />
          <TextInput label="Extra infó" value={extra} onChange={(e) => setExtra(e.currentTarget.value)} />
          <TextInput label="Érdekesség" value={fact} onChange={(e) => setFact(e.currentTarget.value)} />
        </div>
      </SimpleGrid>




      {errors.general && <div style={{ color: "red", marginTop: "10px" }}>{errors.general}</div>}
      <Button onClick={handleSubmit} fullWidth mt="md">
        {isEditing ? "Frissítés" : "Hozzáadás"}
      </Button>
    </Modal>
  );
};

export default AdminProductModal;