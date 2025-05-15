import { Box, Container, rem, useMantineTheme, Divider, Button, Menu, Loader } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useState, JSX } from 'react';
import { useCategory } from '../hooks/useCategory';
import { IconMenu2, IconBox, IconLeaf, IconFlame, IconCandle, IconTool, IconBraces, IconStar, IconPercentage, IconStarFilled, IconArticle, IconGift } from '@tabler/icons-react';
import SearchBar from './search/SearchBar';
import SearchBarMobile from './search/SearchBarMobile';
import LoginComponent from './LoginComponent';
import FavoritesComponent from './FavoritesComponent';
import CartComponent from './CartComponent';
import { useMediaQuery } from '@mantine/hooks';
import '@mantine/core/styles.css';

export function AppHeader() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { categories, loading, error } = useCategory();
  const [menuOpened, setMenuOpened] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

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

    const handleMenuToggle = () => {
    setMenuOpened(!menuOpened);
    setSearchOpen(false); 
  };

  return (
    <>
      {/* 🔥 Hirdetőszalag */}
      <Box
        style={{
          backgroundColor: theme.colors.green?.[6] || '#4caf50',
          color: theme.white,
          textAlign: 'center',
          padding: `${rem(6)} ${rem(12)}`,
          fontSize: rem(14),
          fontWeight: 500,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        Ingyenes szállítás 20.000 Ft felett! 🚚
      </Box>

      <Box
        style={{
          position: 'fixed',
          top: 34,
          left: 0,
          right: 0,
          backgroundColor: theme.colors.white ? theme.colors.white[0] : '#ffffff',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          padding: `${rem(10)} ${rem(16)}`,
        }}
      >
        <Container size="xl" style={{ display: 'flex', alignItems: 'center', height: '100%'}}>
          {/* 🌍 Hamburger menü mobilon */}
          {isMobile && (
            <Menu opened={menuOpened} onChange={setMenuOpened}  width={200}>
              <Menu.Target>
                <Button
                  variant="subtle"
                  color="green"
                  onClick={handleMenuToggle}
                  leftSection={<IconMenu2 size={18} />}
                  style={{
                    padding: `${rem(4)} ${rem(8)}`,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                />
              </Menu.Target>
              <Menu.Dropdown>
                {/* 🔄 Betöltés állapota */}
                {loading && (
                  <Menu.Item disabled>
                    <Loader size="xs" /> Betöltés...
                  </Menu.Item>
                )}
                {/* ❌ Hiba állapota */}
                {error && (
                  <Menu.Item disabled color="red">
                    {error}
                  </Menu.Item>
                )}
                {/* ✅ Kategóriák listázása */}
                {!loading &&
                  !error &&
                  allCategories.map((category, idx) => (
                    <Menu.Item
                    key={`${category.id ?? 'all'}-${idx}`}
                      onClick={() => handleCategoryClick(category.name || null)}
                      style={{
                        fontSize: rem(14),
                        fontWeight: 500,
                        transition: 'background 0.2s ease-in-out',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#eef7f0')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      leftSection={iconMap[category.name || ""] || <IconBox size={18} color="#16b040" />}
                    >
                      {category.name}
                    </Menu.Item>
                  ))}
                  <Divider my="xs" color="gray" />
            <Menu.Item  
            style={{
                        fontSize: rem(14),
                        fontWeight: 500,
                        transition: 'background 0.2s ease-in-out',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#eef7f0')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      leftSection={<IconArticle size={18} color="#16b040" />}
                      onClick={() => navigate('/blog')}>Blog</Menu.Item>
            <Menu.Item 
            style={{
                        fontSize: rem(14),
                        fontWeight: 500,
                        transition: 'background 0.2s ease-in-out',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#eef7f0')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      leftSection={<IconGift size={18} color="#16b040" />}
            onClick={() => navigate("/rewardprogram")}>Hűségprogram</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
          {/* 🌍 Logo */}
          <Box
            style={{
              fontSize: rem(20), // Kisebb méret mobilon
              fontWeight: 700,
              color: theme.colors.green?.[7] || 'green',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onClick={() => navigate('/')}
          >
            Globify
          </Box>


          {/* 🛒 Jobb oldali ikonok */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? rem(3) : rem(16),
               marginLeft: 'auto',
            }}
          >
                    {isMobile ? (
          <SearchBarMobile searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
        ) : (
          <Box style={{ width: rem(300) }}>
            <SearchBar />
          </Box>
        )}
            <LoginComponent />
            <FavoritesComponent />
            <CartComponent />
            
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default AppHeader;
