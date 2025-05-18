import { useEffect, useState, JSX } from "react";
import { Container, Grid, Paper, Text, Image, Stack, ActionIcon, Group, Loader } from "@mantine/core";
import { useSaleProducts, usePopularProducts } from "../hooks/useFeaturedProducts";
import { 
  IconChevronLeft, 
  IconChevronRight,   
  IconBox,
  IconLeaf,
  IconFlame,
  IconCandle,
  IconTool,
  IconBraces,
  IconStar,
  IconPercentage,
  IconStarFilled,
} from "@tabler/icons-react";
import { useCategory } from "../hooks/useCategory";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../config/config';





const HomePage = () => {
  const { categories, loading, error } = useCategory();
  const [banners, setBanners] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { data: saleProducts = [] } = useSaleProducts();
const { data: popularProducts = [] } = usePopularProducts();

const [saleIndex, setSaleIndex] = useState(0);
const [popularIndex, setPopularIndex] = useState(0);

const visibleSale = saleProducts.slice(saleIndex, saleIndex + 3);
const visiblePopular = popularProducts.slice(popularIndex, popularIndex + 3);

  const allCategories = [
    { id: null, name: "Minden termék" }, 
    { id: "new", name: "Újdonságaink" },
    { id: "sale", name: "Akciós termékek" },
    { id: "popular", name: "Népszerű termékek" },
    ...categories
  ];

  useEffect(() => {
    const bannerImages = [
      "/images/banner-1.jpg",
      "/images/banner-2.jpg",
      "/images/banner-3.jpg",
    ];
    setBanners(bannerImages);

    // Automatikus váltás 5 másodpercenként
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  const handleCategoryClick = (categoryName: string | null) => {
    if (categoryName === "Újdonságaink") {
      navigate("/products?category=new");
    } else if (categoryName === "Akciós termékek") {
      navigate("/products?category=sale");
    } else if (categoryName === "Minden termék" || categoryName === null) {
      navigate("/products");
    } else if (categoryName === "Népszerű termékek") {
        navigate("/products?category=Népszerű termékek");
    } else {
      navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    }
  };

const iconMap: Record<string, JSX.Element> = {
  "Minden termék": <IconBox size={18} color="#16b040" />,
  "Újdonságaink": <IconStar size={18} color="#16b040" />,
  "Akciós termékek": <IconPercentage size={18} color="#16b040" />,
  "Füstölők": <IconFlame size={18} color="#16b040" />,
  "Gyertyák": <IconCandle size={18} color="#16b040" />,
  "Karkötők": <IconBraces size={18} color="#16b040" />,
  "Kiegészítők": <IconTool size={18} color="#16b040" />,
  "Növények": <IconLeaf size={18} color="#16b040" />,
  "Népszerű termékek": <IconStarFilled size={18} color="#16b040" />,
};

  return (
    
    <Container size="xl" my="lg">
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 3 }} visibleFrom="md">
          <Paper shadow="sm" p="md" radius="md">
            <Stack>
              <Text size="lg" fw={700}>Kategóriák</Text>
              {loading ? (
                <Loader size="sm" />
              ) : error ? (
                <Text color="red">{error}</Text>
              ) : (
                allCategories.map((category, idx) => (
                  <Group
                  key={`${category.id ?? "all"}-${idx}`}
                  onClick={() => handleCategoryClick(category.name || null)}
                  style={{ cursor: "pointer",  gap: "8px", alignItems: "center" }}
                  >
                    {iconMap[category.name || ""] || <IconBox size={18} color="#16b040" />}
                    <Text style={{ fontSize: "14px", fontWeight: 500 }}>
                    {category.name}
                  </Text>
                  </Group>
                ))
              )}
            </Stack>
          </Paper>
        </Grid.Col>

        {/* Hirdető szalag */}
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Paper shadow="md" radius="md" style={{ position: "relative", overflow: "hidden" }}>
            <Image
              src={banners[currentIndex]}
              height={500}
              alt={`Banner ${currentIndex + 1}`}
              style={{ objectFit: "cover", width: "100%" }}
            />
            {/* 🔹 Balra nyíl */}
            <ActionIcon
              onClick={goToPrev}
              style={{
                position: "absolute",
                top: "50%",
                left: 10,
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "none",
                color: "black",
              }}
            >
              <IconChevronLeft size={50} />
              </ActionIcon>
            {/* 🔹 Jobbra nyíl */}
            <ActionIcon
              onClick={goToNext}
              style={{
                position: "absolute",
                top: "50%",
                right: 10,
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "none",
                color: "black",
              }}
            >
              <IconChevronRight size={50} />
              </ActionIcon>
            {/* 🔹 Navigációs pontok */}
            <Group justify="center" mt="sm" style={{ position: "absolute", bottom: 10, left: 0, right: 0 }}>
              {banners.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: index === currentIndex ? "#000" : "#ccc",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                />
              ))}
            </Group>
          </Paper>
        </Grid.Col>


 {/* 🔹 Akciós termékek */}
<Grid.Col span={12}>
  <Text size="xl" fw={700} mb="md"         
      style={{
          textAlign: "center",
          marginBottom: 30,
          fontSize: 26,
          fontWeight: 600,
          color: "#357a42",
          display: "inline-block",
          paddingBottom: 8,
        }}>
          Akciós termékek
          </Text>
  {saleProducts.length > 0 && (
    <Group justify="center" gap="lg">
      {saleProducts.length > 3 && (
        <ActionIcon
          onClick={() => setSaleIndex((prev) => Math.max(0, prev - 1))}
          disabled={saleIndex === 0}
          variant="filled"
          color="green"
        >
          <IconChevronLeft />
        </ActionIcon>
      )}
      <Grid gutter="md" justify="center" style={{ flex: 1 }}>
  {visibleSale.map((product, index) => (
    <Grid.Col key={`${product.id}-${index}`} span={4}>
      <Paper 
        shadow="xs" 
        p="md" 
        radius="md"
        style={{ cursor: "pointer" }} 
        onClick={() => navigate(`/products/${product.slug}`)} // 🔹 Navigáció slug alapján
      >
        <Image src={`${API_URL}/uploads/products/${product.imageUrls?.[0] || 'default.jpg'}`} height={150} alt={product.name} />
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
          <Text fw={500} mt="sm">{product.name}</Text>
          {product.price && (
            <Text 
              size="sm" 
              fw={500} 
              style={{ color: product.isSale ? "#FF0000" : "#000000" }}
            >
              {product.price.toLocaleString("hu-HU")} Ft
            </Text>
          )}
        </div>
        <Text size="sm" color="dimmed">{product.title}</Text>
      </Paper>
    </Grid.Col>
  ))}
</Grid>
      {saleProducts.length > 3 && (
        <ActionIcon
          onClick={() => setSaleIndex((prev) => prev + 1)}
          disabled={saleIndex + 3 >= saleProducts.length}
          variant="filled"
          color="green"
        >
          <IconChevronRight />
        </ActionIcon>
      )}
    </Group>
  )}
</Grid.Col>

{/* 🔹 Népszerű termékek */}
<Grid.Col span={12}>
  <Text size="xl" fw={700} mb="md"
   style={{
    textAlign: "center",
    marginBottom: 30,
    fontSize: 26,
    fontWeight: 600,
    color: "#357a42",
    display: "inline-block",
    paddingBottom: 8,
  }}
  >Népszerű termékek
  </Text>
  {popularProducts.length > 0 && (
    <Group justify="center" gap="lg">
      {popularProducts.length > 3 && (
        <ActionIcon
          onClick={() => setPopularIndex((prev) => Math.max(0, prev - 1))}
          disabled={popularIndex === 0}
          variant="filled"
          color="green"
        >
          <IconChevronLeft />
        </ActionIcon>
      )}
      <Grid gutter="md" justify="center" style={{ flex: 1 }}>
  {visiblePopular.map((product, index) => (
    <Grid.Col key={`${product.id}-${index}`} span={4}>
      <Paper 
        shadow="xs" 
        p="md" 
        radius="md"
        style={{ cursor: "pointer" }} 
        onClick={() => navigate(`/products/${product.slug}`)} // 🔹 Navigáció slug alapján
      >
        <Image src={`${API_URL}/uploads/products/${product.imageUrls?.[0] || 'default.jpg'}`} height={150} alt={product.name} />
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
          <Text fw={500} mt="sm">{product.name}</Text>
          {product.price && (
            <Text 
              size="sm" 
              fw={500} 
              style={{ color: product.isSale ? "#FF0000" : "#000000" }}
            >
              {product.price.toLocaleString("hu-HU")} Ft
            </Text>
          )}
        </div>
        <Text size="sm" color="dimmed">{product.title}</Text>
      </Paper>
    </Grid.Col>
  ))}
</Grid>
      {popularProducts.length > 3 && (
        <ActionIcon
          onClick={() => setPopularIndex((prev) => prev + 1)}
          disabled={popularIndex + 3 >= popularProducts.length}
          variant="filled"
          color="green"
        >
          <IconChevronRight />
        </ActionIcon>
      )}
    </Group>
  )}
</Grid.Col>

      </Grid>
    </Container>
  );
};

export default HomePage;
