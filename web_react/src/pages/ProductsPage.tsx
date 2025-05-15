import React, { useState, useEffect } from "react";
import { Modal } from "@mantine/core";
import { Pagination } from "@mantine/core";
import { useProducts } from "../hooks/useProducts";
import { useFavorite } from "../context/FavoriteContext";
import { useCart } from "../context/CartContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductModal from "../modal/ProductModal";
import { Product } from "../types";
import { useProductRatings } from "../hooks/useProductRatings";
import { Button, ActionIcon, Group, Rating, Divider, Box } from "@mantine/core";
import { IconHeart, IconShoppingCart } from "@tabler/icons-react";
import { API_URL } from '../config/config';
import { useMediaQuery } from '@mantine/hooks';
import { useProductFilters } from "../hooks/useProductFilters";
import { FilterControls } from "../components/FilterControls";
import { SortControl } from "../components/SortControl";
import { formatPrice } from "../utils/formatPrice";

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const searchTerm = searchParams.get("search") || "";
  const shouldShowFilters = category === "";
  const { filters, setFilters } = useProductFilters();
  const isNew = category === "new" ? true : undefined;
  const isSale = category === "sale" ? true : undefined;
  const isPopular = category === "Népszerű termékek";
  const { data, isLoading, error } = useProducts({
    category,
    searchTerm,
    page: page - 1,
    filters: shouldShowFilters ? filters : undefined,
    isNew,
    isSale,
    isPopular: isPopular ? true : undefined,
  });
  const { favorites, addFavorite, removeFavorite } = useFavorite();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const { addToCart } = useCart();
  const { averageRatings } = useProductRatings(data?.content || []);
  const [sortOrder, setSortOrder] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)') ?? false;
  const isSmallScreen = useMediaQuery('(max-width: 480px)');
  const navigate = useNavigate();
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [category, searchTerm, filters]);

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

    const discount = product.discountPercentage ?? 0;
    const finalPrice = discount > 0
      ? Math.round(product.price * (1 - discount / 100))
      : product.price;

    const discountedProduct = {
      ...product,
      price: finalPrice, // felülírjuk az árát
    };

    addToCart(discountedProduct);
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

  let filteredProducts = (data?.content || []).filter((product) => product.available);

  if (sortOrder === "priceAsc") {
    filteredProducts.sort((a, b) => {
      const aPrice = a.discountPercentage ? a.price * (1 - a.discountPercentage / 100) : a.price;
      const bPrice = b.discountPercentage ? b.price * (1 - b.discountPercentage / 100) : b.price;
      return aPrice - bPrice;
    });
  } else if (sortOrder === "priceDesc") {
    filteredProducts.sort((a, b) => {
      const aPrice = a.discountPercentage ? a.price * (1 - a.discountPercentage / 100) : a.price;
      const bPrice = b.discountPercentage ? b.price * (1 - b.discountPercentage / 100) : b.price;
      return bPrice - aPrice;
    });
  } else if (sortOrder === "nameAsc") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === "nameDesc") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  }

  const totalPages = data?.totalPages || 1;



  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px" }}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: 30,
          fontSize: 26,
          fontWeight: 600,
          color: "#2f5e38",
          borderBottom: "2px solid #77C27A",
          display: "inline-block",
          paddingBottom: 8,
        }}
      >
        {category === "new"
          ? "Újdonságaink"
          : category === "sale"
            ? "Akciós termékek"
            : category
              ? category
              : "Minden termék"}
      </h1>

      <Divider my="sm" labelPosition="left" />
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        {shouldShowFilters ? (
          <>
            <FilterControls
              filters={filters}
              setFilters={setFilters}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              isMobile={isMobile}
            />
            <SortControl
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              isMobile={isMobile}
            />
          </>
        ) : (
          <SortControl
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            isMobile={isMobile}
          />
        )}
      </Box>
      <Divider my="sm" labelPosition="left" />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: isMobile ? "15px" : "30px",
          justifyContent: "center",
        }}
      >

        {filteredProducts.map((product: Product) => {
          const imageUrl = product.imageUrls.length > 0
            ? `${API_URL}/uploads/products/${product.imageUrls[0]}`
            : `${API_URL}/uploads/products/default.jpg`;
          const isDiscounted = (product.discountPercentage ?? 0) > 0;
          const discountedPrice = isDiscounted
            ? Math.round(product.price * (1 - (product.discountPercentage ?? 0) / 100))
            : product.price;

          const isFavorite = favorites.some((fav) => fav.id === product.id);

          return (

            <div
              key={product.id}
              style={{
                position: "relative",
                width: isSmallScreen ? "100%" : isMobile ? "45%" : "300px",
                minHeight: isMobile ? 350 : 450,
                display: "flex",
                flexDirection: "column",
                border: "none",
                borderRadius: 8,
                backgroundColor: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                padding: 16,
                boxSizing: "border-box",
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (product.slug) {
                  navigate(`/products/${product.slug}`);
                } else {
                  console.log("Navigálás próbálkozás:", product.slug, product);
                  console.warn("Hiányzó slug:", product);
                }
              }}
            >
              {isDiscounted && (
                <div style={{
                  position: "absolute",
                  top: 8,
                  right: 10,
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: 6,
                  width: 35,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: 14,
                  zIndex: 2,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  transform: "rotate(30deg)"
                }}>
                  <span style={{ display: "inline-block" }}>
                    {product.discountPercentage}%
                  </span>
                </div>
              )}
              <div
                style={{
                  width: "100%",
                  height: isMobile ? 180 : 240,
                  overflow: "hidden",
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                {product.isNew && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#2ecc71", // szép zöld árnyalat
                      color: "#fff",
                      padding: "4px 12px",
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: 13,
                      zIndex: 2,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    Most érkezett
                  </div>
                )}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageUrl(imageUrl);
                  }}
                  style={{
                    width: "100%",
                    height: isMobile ? 180 : 240,
                    overflow: "hidden",
                    borderRadius: 8,
                    marginBottom: 12,
                    cursor: "zoom-in",
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
              </div>
              <h3
                onClick={(e) => {
                  e.stopPropagation();
                  if (product.slug) {
                    navigate(`/products/${product.slug}`);
                  } else {
                    console.log("Navigálás próbálkozás:", product.slug, product);
                    console.warn("Hiányzó slug:", product);
                  }
                }}
                style={{
                  fontSize: 20,
                  margin: "0 0 6px",
                  color: "#2f5e38",
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

              <div style={{ marginBottom: 12 }}>
  {isDiscounted ? (
    <div>
  <span style={{
    textDecoration: "line-through",
    color: "#888",
    fontSize: 16,
    marginRight: 8,
  }}>
    {formatPrice(product.price)}
  </span>
  <span style={{
    color: "red",
    fontWeight: "bold",
    fontSize: 20,
  }}>
    {formatPrice(discountedPrice)}
  </span>
</div>
  ) : (
    <span style={{
      fontWeight: "bold",
      fontSize: 20,
      color: "#333"
    }}>
      {formatPrice(product.price)}
    </span>
  )}
</div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",

                }}
              >
                <Group justify="space-between">
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

      <Modal
        opened={!!selectedImageUrl}
        onClose={() => setSelectedImageUrl(null)}
        size="auto"
        centered={false}
        withCloseButton
        styles={{
          content: {
            marginTop: isMobile ? "20vh" : "10vh", // 20% / 30% magasság a felső szélhez képest
          },
        }}
      >
        <img
          src={selectedImageUrl ?? ""}
          alt="Termék kép"
          style={{
            width: isMobile ? "100%" : "auto",
            maxWidth: isMobile ? "100%" : "600px", // desktopon legfeljebb 600px széles
            height: "auto",
            display: "block",
            margin: "0 auto",
          }}
        />
      </Modal>


      {totalPages > 1 && (
        <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
          <Pagination
            value={page}
            onChange={setPage}
            total={totalPages}
            size="md"
            radius="md"
            color="green"
          />
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
