import { useNewProducts } from "../hooks/useProducts"; // vagy külön hook fájlból
import { Card, Image, Text, Group, Loader, SimpleGrid } from "@mantine/core";
import { IconPlant } from "@tabler/icons-react";
import { useState } from "react";
import ProductModal from "../modal/ProductModal";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config/config";

const NewProducts = () => {
    const { data: products, isLoading, error } = useNewProducts();
    const { addToCart } = useCart();
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [modalOpened, setModalOpened] = useState(false);

    if (isLoading) return <Loader />;
    if (error) return <Text color="red">Hiba történt: {error.message}</Text>;

    return (
        <div>
            <h1
                style={{
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "28px",
                    marginBottom: "15px",
                }}
            >Új termékek
            </h1>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
                {products?.map((product) => (
                    <Card key={product.id} shadow="md" padding="lg" radius="md" withBorder style={{ cursor: "pointer" }} onClick={() => {
                        setSelectedProductId(product.id ?? null); setModalOpened(true);
                    }}>
                        <Card.Section>
                            <Image
                                src={
                                    product.imageUrls.length > 0
                                        ? `${API_URL}/uploads/products/${product.imageUrls[0]}`
                                        : `${API_URL}/uploads/products/default.jpg`
                                }
                                height={160}
                                alt={product.name}

                            />
                        </Card.Section>
                        <Group justify="space-between" mt="md" mb="xs">
                            <Text fw={500}>{product.name}</Text>
                            <Text c="green" fw={700}>
                                {product.price.toFixed(0)} Ft
                            </Text>
                        </Group>
                        <Text size="sm" c="dimmed" lineClamp={2}>
                            {product.description}
                        </Text>
                    </Card>
                ))}
            </SimpleGrid>

            <ProductModal
                productId={selectedProductId}
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                addToCart={addToCart}
            />
        </div>


    );
};

export default NewProducts;
