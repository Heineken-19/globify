import { useState } from "react";
import { Box, rem, Menu, Button, Loader } from "@mantine/core";
import { IconMenu2, IconHome } from "@tabler/icons-react";
import { useCategory } from "../hooks/useCategory";
import { useLocation, useNavigate } from "react-router-dom";

export default function CategoryBar() {
  const { categories, loading, error } = useCategory();
  const [opened, setOpened] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (
    location.pathname === "/" || // 🔥 Ne jelenjen meg a főoldalon
    location.pathname.startsWith("/admin") || 
    location.pathname.startsWith("/cart")
  ) {
    return null;
  }

  const allCategories = [
    { id: null, name: "Minden termék" }, // 🔥 Minden termék hozzáadása
    ...categories
  ];

  const handleCategoryClick = (categoryName: string | null) => {
    if (categoryName) {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  } else {
    navigate(`/products`); // 🔥 Ha null → Minden terméket megjelenítünk
  }
};
  


  return (
    <Box
      style={{
        position: "fixed",
        top: rem(94), // A Header alá kerül
        left: 0,
        right: 0,
        height: rem(40),
        backgroundColor: "#f8f9fa",
        zIndex: 998,
        display: "flex",
        alignItems: "center",
        padding: `0 ${rem(20)}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        justifyContent: "flex-start",
        paddingLeft: rem(130),
      }}
    >
      {/* Kategóriák Menü */}
      <Menu opened={opened} onChange={setOpened} width={200} >
        <Menu.Target>
          <Button variant="subtle" color="#77C27A" onClick={() => setOpened((o) => !o)} leftSection={<IconMenu2 size={18} /> }>
            Kategóriák
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {loading && ( <Menu.Item disabled><Loader size="xs" />Betöltés...</Menu.Item>)}
          {error && ( <Menu.Item disabled color="red">{error}</Menu.Item>)}
          {!loading && !error &&
            allCategories.map((category) => (
              <Menu.Item 
              key={category.id ?? "all"}
              onClick={() => handleCategoryClick(category.name || null)}
              style={{
                fontSize: rem(14),
                fontWeight: 500,
                transition: "background 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#eef7f0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
                {category.name}</Menu.Item>
            ))}
        </Menu.Dropdown>
      </Menu>
      <Menu>
      <Button variant="subtle" color="#77C27A" onClick={() => navigate('/')} leftSection={<IconHome size={18} /> }>
            Főoldal
          </Button>
      </Menu>

      
    </Box>
  );
}
