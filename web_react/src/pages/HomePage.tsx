import { useEffect, useState } from "react";
import { Container, Grid, Paper, Text, Image, Stack, Button, Group, Loader } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useCategory } from "../hooks/useCategory";
import { useNavigate } from "react-router-dom";


// 🔹 Mock akciós termékek
const mockSaleProducts = [
  {
    id: 1,
    name: "Akciós termék 1",
    description: "Ez egy rövid leírás az akciós termékről.",
    image: "/images/sale-1.jpg",
  },
  {
    id: 2,
    name: "Akciós termék 2",
    description: "Ez egy rövid leírás az akciós termékről.",
    image: "/images/sale-2.jpg",
  },
  {
    id: 3,
    name: "Akciós termék 3",
    description: "Ez egy rövid leírás az akciós termékről.",
    image: "/images/sale-3.jpg",
  },
  {
    id: 3,
    name: "Akciós termék 4",
    description: "Ez egy rövid leírás az akciós termékről.",
    image: "/images/sale-4.jpg",
  },
];


const HomePage = () => {
  const { categories, loading, error } = useCategory();
  const [banners, setBanners] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const allCategories = [
    { id: null, name: "Minden termék" }, 
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
    if (categoryName) {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  } else {
    navigate(`/products`); // 🔥 Ha null → Minden terméket megjelenítünk
  }
};

  return (
    <Container size="xl" my="lg">
      <Grid gutter="md">
        {/* Bal oldali menü */}
        <Grid.Col span={3}>
          <Paper shadow="sm" p="md" radius="md">
            <Stack>
              <Text size="lg" fw={700}>Kategóriák</Text>
              {loading ? (
                <Loader size="sm" />
              ) : error ? (
                <Text color="red">{error}</Text>
              ) : (
                allCategories.map((category) => (
                  <Text
                  key={category.id ?? "all"}
                  onClick={() => handleCategoryClick(category.name || null)}
                  style={{ cursor: "pointer" }}
                  >
                    {category.name}
                  </Text>
                ))
              )}
            </Stack>
          </Paper>
        </Grid.Col>

        {/* Hirdető szalag */}
        <Grid.Col span={9}>
          <Paper shadow="md" radius="md" style={{ position: "relative", overflow: "hidden" }}>
            <Image
              src={banners[currentIndex]}
              height={500}
              alt={`Banner ${currentIndex + 1}`}
              style={{ objectFit: "cover", width: "100%" }}
            />
            {/* 🔹 Balra nyíl */}
            <Button
              onClick={goToPrev}
              style={{
                position: "absolute",
                top: "50%",
                left: 10,
                transform: "translateY(-50%)",
                zIndex: 10,
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
              }}
            >
              <IconChevronLeft size={20} />
            </Button>
            {/* 🔹 Jobbra nyíl */}
            <Button
              onClick={goToNext}
              style={{
                position: "absolute",
                top: "50%",
                right: 10,
                transform: "translateY(-50%)",
                zIndex: 10,
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
              }}
            >
              <IconChevronRight size={20} />
            </Button>
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

        {/* Akciós termékek */}
        <Grid.Col span={12}>
        <Text size="xl" fw={700} mb="md">Akciós termékek</Text>
          <Grid gutter="md">
          {mockSaleProducts.map((product) => (
              <Grid.Col key={product.id} span={4}>
                <Paper shadow="xs" p="md" radius="md">
                  <Image
                    src={product.image}
                    height={150}
                    alt={product.name}
                  />
                  <Text fw={500} mt="sm">{product.name}</Text>
                  <Text size="sm" color="dimmed">{product.description}</Text>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default HomePage;
