import { useState } from "react";
import { Card, Image, Text, Button, Grid, Badge, Group, Container } from "@mantine/core";
import { useAdminDiscounts } from "../../hooks/admin/useAdminDiscounts";
import DiscountAdminModal from "../../modal/admin/DiscountAdminModal";
import { API_URL } from "../../config/config";
import AdminBar from "./AdminBar";

export default function AdminDiscount() {
  const { productsQuery, updateDiscountMutation } = useAdminDiscounts();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (productId: number, currentDiscount: number | null) => {
    setSelectedProductId(productId);
    setSelectedDiscount(currentDiscount);
    setModalOpen(true);
  };

  const handleSave = (discount: number) => {
    if (selectedProductId != null) {
      updateDiscountMutation.mutate({ productId: selectedProductId, discount });
      setModalOpen(false);
    }
  };

  return (
    <Container size="xl" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
          <AdminBar />
    <>
      <Text size="xl" fw={700} mb="md">Akciós termékek</Text>
      <Grid>
        {productsQuery.data?.map((product) => {
          const image = product.imageUrls?.[0] || "default.jpg";
          return (
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={product.id}>
              <Card shadow="sm" padding="lg">
                <Card.Section>
                  <Image src={`${API_URL}/uploads/products/${image}`} height={160} alt={product.name} />
                </Card.Section>
                <Group justify="space-between" mt="md">
                  <Text fw={600}>{product.name}</Text>
                  {product.discountPercentage && (
                    <Badge color="red" variant="filled">-{product.discountPercentage}%</Badge>
                  )}
                </Group>
                <Text size="sm" color="dimmed">{product.price.toLocaleString()} Ft</Text>
                <Button fullWidth mt="md" onClick={() => handleEdit(product.id, product.discountPercentage ?? null)}>
                  Kedvezmény szerkesztése
                </Button>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>

      <DiscountAdminModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        productId={selectedProductId!}
        currentValue={selectedDiscount}
        onSave={handleSave}
      />
    </>
    </Container>
  );
}
