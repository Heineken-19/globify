import { useState, JSX } from "react";
import { Box, rem, Menu, Button, Loader } from "@mantine/core";
import { 
  IconHome,
  IconMenu2,
  IconBox,
  IconLeaf,
  IconFlame,
  IconCandle,
  IconTool,
  IconBraces,
  IconStar,
  IconPercentage,
  IconBuildingStore,
  IconStarFilled,
  IconArticle,
  IconGift
} from "@tabler/icons-react";
import { useCategory } from "../hooks/useCategory";
import { useLocation, useNavigate } from "react-router-dom";

export default function CategoryBar() {
  const { categories, loading, error } = useCategory();
  const [opened, setOpened] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (
    location.pathname.startsWith("/admin") || 
    location.pathname.startsWith("/cart")
  ) {
    return null;
  }

  const handleRewardClick = () => navigate("/rewardprogram");
  const isHomePage = location.pathname === "/";

  const allCategories = [
    { id: null, name: "Minden termék" }, 
    { id: "new", name: "Újdonságaink" },
    { id: "sale", name: "Akciós termékek" },
    { id: "popular", name: "Népszerű termékek" },
    ...categories
  ];

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
    <Box
    visibleFrom="md"
      style={{
        position: "fixed",
        top: rem(96), // A Header alá kerül
        left: 0,
        right: 0,
        height: rem(40),
        backgroundColor: "#f8f9fa",
        zIndex: 998,
        display: "flex",
        alignItems: "center",
        padding: `0 ${rem(5
        )}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        justifyContent: "flex-start",
        paddingLeft: rem(100),
      }}
    >

  {!isHomePage && (
    <Box style={{ display: "flex", alignItems: "center", gap: rem(15) }}>
      <Menu opened={opened} onChange={setOpened} width={200} >
        <Menu.Target>
          <Button variant="subtle" color="#16b040" onClick={() => setOpened((o) => !o)} leftSection={<IconMenu2 size={18} /> }>
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
              leftSection={iconMap[category.name || ""] || <IconBox size={18} color="#16b040" />}
            >
                {category.name}</Menu.Item>
            ))}
        </Menu.Dropdown>
      </Menu>
      </Box>
  )}

      {!isHomePage && (
        <>
      <Button variant="subtle" color="#16b040" onClick={() => navigate('/products?category=new')} leftSection={<IconBuildingStore size={18} /> }>
      Újdonságaink
          </Button> 
          <Button variant="subtle" color="#16b040" onClick={() => navigate('/products?category=sale')} leftSection={<IconPercentage size={18} /> }>
      Akciós termékek
          </Button> 
        </>
      )}
 

      <Box style={{ display: "flex", alignItems: "center", gap: rem(15), justifyContent: "flex-end", flexGrow: 1, paddingRight: rem(100) }}>
                  <Button variant="subtle" color="#16b040" onClick={() => navigate('/blog')} leftSection={<IconArticle size={18} /> }>
      Blog
          </Button>
      <Button variant="subtle" color="#16b040" onClick={handleRewardClick} leftSection={<IconGift size={18}/>}>
        Hűségprogram
      </Button>
      </Box>
    </Box>


  );
  
}
