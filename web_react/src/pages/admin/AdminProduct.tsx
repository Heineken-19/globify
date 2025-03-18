import { useState } from "react";
import { Card, Image, Text, Button, Group, Container, Title, Grid} from "@mantine/core";
import AdminBar from "./AdminBar";
import { useAdminProducts, useDeleteProduct } from "../../hooks/admin/useAdminProduct";
import AdminProductModal from "../../modal/admin/AdminProductModal";
import AddCategoryModal from "../../modal/AddCategoryModal";
import type { AdminProduct } from "../../types";
import { API_URL } from '../../config/config';

const AdminProduct = () => {
  const { data: products, isLoading } = useAdminProducts();
  const { mutate: deleteProduct } = useDeleteProduct();

  const [modalOpen, setModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);


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
      <Button onClick={openAddCategoryModal} style={{ marginLeft: "5px",marginBottom: "20px" }}>
        Kategória hozzáadása
      </Button>

      

      <Grid>
        {products?.map((product: AdminProduct) => {

          const imageUrl = product.imageUrls.length > 0
            ? `${API_URL}/uploads/${product.imageUrls[0]}`
            : `${API_URL}/uploads/default.jpg`;

          return (
            <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image src={imageUrl} height={150} fit="cover" alt={product.name} />
                </Card.Section>

                <Title order={4} mt="md">{product.name}</Title>
                <Text size="sm" color="dimmed" lineClamp={2}>{product.description}</Text>

                <Text fw={500} size="lg" mt="md">{product.price} Ft</Text>
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
      <AdminProductModal opened={modalOpen} onClose={() => setModalOpen(false)} product={selectedProduct} />
      <AddCategoryModal opened={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} />
    </Container>
  );
}


export default AdminProduct;