import { useFavorite } from "../context/FavoriteContext";
import { Card, Avatar, Text, Group, Button, Container } from "@mantine/core";
import UserBar from "../components/UserBar";
import { API_URL } from '../config/config';
import { formatPrice } from "../utils/formatPrice";

const FavoritePage = () => {
  const { favorites, removeFavorite, loading, error } = useFavorite();

  if (loading) return <Text>Betöltés...</Text>;
  if (error) return <Text color="red">{error}</Text>;

  return (
    <Container size="md" py="xl">
      <UserBar />
      <div>
        {favorites.length === 0 ? (
          <Text>Nincsenek kedvenc termékek.</Text>
        ) : (
          favorites.map((product) => {
            const imageUrl =
              product.imageUrls && product.imageUrls.length > 0
                ? `${API_URL}/uploads/products/${product.imageUrls[0]}`
                : `${API_URL}/uploads/products/default.jpg`;

            return (

              <Card key={product.id} shadow="sm" padding="lg" style={{ marginBottom: '1rem' }}>
                <Group align="start">
                  {/* Termék képe */}
                  <Avatar
                    src={imageUrl}
                    alt={product.name}
                    style={{ width: 80, height: 80 }}
                  />

                  <div style={{ flex: 1 }}>
                    {/* Termék név */}
                    <Text fw={500}>{product.name}</Text>
                    {/* Termék cím */}
                    <Text size="sm" color="gray">{product.title}</Text>
                    {/* Termék leírás */}
                    <Text size="sm">{product.description}</Text>
                    {/* Méret és típus */}
                    <Group gap="xs">
                      <Text size="xs">Méret: {product.size}</Text>
                      <Text size="xs">Típus: {product.type}</Text>
                    </Group>
                    {/* Elérhetőség */}
                    <Text size="xs" color={product.available ? "green" : "red"}>
                      {product.available ? "Elérhető" : "Nem elérhető"}
                    </Text>
                  </div>

                  {/* Ár */}
                  <Text fw={700} style={{ marginRight: '1rem' }}>
                    {formatPrice(product.price)}
                  </Text>

                  {/* Eltávolítás */}
                  <Button
                    color="red"
                    size="xs"
                    onClick={() => removeFavorite(product.id)}
                  >
                    Eltávolítás
                  </Button>
                </Group>
              </Card>
            );
          })
        )}
      </div>
    </Container>
  );
};

export default FavoritePage;
