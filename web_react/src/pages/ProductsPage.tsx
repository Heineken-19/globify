import React, { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useFavorite } from "../context/FavoriteContext";
import { useCart } from "../context/CartContext";
import { useSearchParams } from "react-router-dom";
import ProductModal from "../modal/ProductModal";
import { Product } from "../types";
import { useProductRatings } from "../hooks/useProductRatings";
import { Button, ActionIcon, Group, Rating } from "@mantine/core";
import { IconHeart, IconShoppingCart } from "@tabler/icons-react";
import { API_URL } from '../config/config';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const searchTerm = searchParams.get("search") || "";
  const { products, isLoading, error } = useProducts(category || undefined, searchTerm);
  const { favorites, addFavorite, removeFavorite } = useFavorite();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const { addToCart } = useCart();
  const { averageRatings } = useProductRatings(products);

  const handleFavoriteClick = async (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!product?.id) return;
    const isFavorite = favorites.some((fav) => fav.id === product.id);
    if (isFavorite) {
      await removeFavorite(product.id);
    } else {
      await addFavorite(product);
    }
  };
  
  const handleAddToCart = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!product) return;
    addToCart(product); // ✅ Az értesítést a CartContext kezeli
  };

  if (isLoading) {
    return <div style={{ textAlign: "center", padding: 20 }}>Betöltés...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", color: "red", padding: 20 }}>
        Hiba történt az adatok lekérésekor.
      </div>
    );
  }

  const filteredProducts = products?.filter((product) => product.available);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px" }}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: 30,
          fontSize: 32,
          color: "#333",
        }}
      >
        {category ? `${category}` : "Összes termék"}
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          justifyContent: "center",
        }}
      >
        {filteredProducts?.map((product) => {
          const imageUrl = product.imageUrls.length > 0
            ? `${API_URL}/uploads/${product.imageUrls[0]}`
            : `${API_URL}/uploads/default.jpg`;

          const isFavorite = favorites.some((fav) => fav.id === product.id);

          return (
            <div
              key={product.id}
              style={{
                width: 300,
                minHeight: 450,
                display: "flex",
                flexDirection: "column",
                border: "none",
                borderRadius: 8,
                backgroundColor: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                padding: 16,
                boxSizing: "border-box",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedProductId(product.id ?? null); // Ha az id undefined, akkor legyen null
                setModalOpened(true);
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 240,
                  overflow: "hidden",
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >

                <img
                  src={imageUrl}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: 20,
                  margin: "0 0 6px",
                  color: "#333",
                  fontWeight: 600,
                }}
              >
                {product.name}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#666",
                  margin: "0 0 8px",
                  flexGrow: 1,
                  lineHeight: 1.4,
                }}
              >
                {product.description}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Rating value={averageRatings[product.id] || 0} readOnly />
                <span>({averageRatings[product.id]?.toFixed(1) || 0})</span>
              </div>

              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  marginBottom: 12,
                  color: "#333",
                }}
              >
                {product.price} Ft
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",

                }}
              >
                <Group  justify="space-between">
                  <Button
                    color="green"
                    leftSection={<IconShoppingCart size={18} />}
                    onClick={(event) => handleAddToCart(product, event)}
                  >
                    Kosárba
                  </Button>

                  <ActionIcon
                    onClick={(event) => handleFavoriteClick(product, event)}
                    size="lg"
                    variant="light"
                  >
                    <IconHeart size={24} color={isFavorite ? "red" : "gray"} />
                  </ActionIcon>
                </Group>
              </div>
            </div>
          );
        })}
      </div>

      <ProductModal
        productId={selectedProductId}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        addToCart={addToCart}
      />
    </div>
  );
};

export default ProductsPage;
