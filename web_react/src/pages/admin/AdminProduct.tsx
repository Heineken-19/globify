import { useState } from "react";
import { Pagination } from "@mantine/core";
import { Card, Image, Text, Button, Group, Container, Title, Grid } from "@mantine/core";
import AdminBar from "./AdminBar";
import { useAdminProducts, useDeleteProduct } from "../../hooks/admin/useAdminProduct";
import AdminProductModal from "../../modal/admin/AdminProductModal";
import AddCategoryModal from "../../modal/AddCategoryModal";
import type { AdminProduct } from "../../types";
import { API_URL } from '../../config/config';

const AdminProduct = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { data, isLoading } = useAdminProducts(currentPage);
  const { mutate: deleteProduct } = useDeleteProduct();
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const products = data?.content || [];
  const totalPages = data?.totalPages || 1;

  const openAddModal = () => {
    setSelectedProduct(null); // Új termék hozzáadása
    setModalOpen(true);
  };

  const openEditModal = (product: AdminProduct) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const openAddCategoryModal = () => {
    setCategoryModalOpen(true);
  };

  if (isLoading) return <p>Betöltés...</p>;

  return (
    <Container size="xl">
      <AdminBar />
      <Title order={2} style={{ marginBottom: "20px" }}>Termékek kezelése</Title>
      <Button onClick={() => openAddModal()} style={{ marginBottom: "20px" }}>
        Új termék hozzáadása
      </Button>
      <Button onClick={openAddCategoryModal} style={{ marginLeft: "5px", marginBottom: "20px" }}>
        Kategória hozzáadása
      </Button>



      <Grid>
  {products?.map((product: AdminProduct) => {
    const imageUrl = product.imageUrls.length > 0
      ? `${API_URL}/uploads/products/${product.imageUrls[0]}`
      : `${API_URL}/uploads/products/default.jpg`;

    return (
      <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Image src={imageUrl} height={150} fit="cover" alt={product.name} />
          </Card.Section>

          <Title order={4} mt="md">{product.name}</Title>
          <Text size="sm" color="dimmed" lineClamp={2}>{product.description}</Text>
          
          {product.isNew && (
            <Text size="xs" color="green" style={{ fontWeight: 700 }}>
              Új termék
            </Text>
          )}

          <Text fw={500} size="lg" mt="md">{product.price} Ft</Text>
          {product.isSale && (
            <Text size="xs" color="red" style={{ fontWeight: 700 }}>
              Akció: {product.discountPercentage ?? 0}%
            </Text>
          )}
          <Text size="sm" color={product.available ? "green" : "red"}>
            {product.available ? "Elérhető" : "Nem elérhető"}
          </Text>
          <Text size="sm" color="gray">Készlet: {product.stock}</Text>

          <Group justify="space-between" mt="md">
            <Button onClick={() => openEditModal(product)} variant="outline" fullWidth>
              Szerkesztés
            </Button>
            <Button color="red" fullWidth mt="md" radius="md" onClick={() => deleteProduct(product.id)}>
              Törlés
            </Button>
          </Group>
        </Card>
      </Grid.Col>
    );
  })}
</Grid>

      <Group justify="center" mt="lg">
        <Pagination
          total={totalPages}
          value={currentPage + 1}
          onChange={(page) => setCurrentPage(page - 1)}
        />
      </Group>

      <AdminProductModal opened={modalOpen} onClose={() => setModalOpen(false)} product={selectedProduct} />
      <AddCategoryModal opened={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} />
    </Container>
  );
}


export default AdminProduct;