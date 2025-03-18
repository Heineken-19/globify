import { Box, Container, rem, useMantineTheme } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import LoginComponent from './LoginComponent';
import FavoritesComponent from './FavoritesComponent';
import CartComponent from './CartComponent';

import '@mantine/core/styles.css'; // Mantine 7 natív CSS

export function AppHeader() {
  const theme = useMantineTheme(); // Mantine 7-ben ajánlott mód a theme használatához
  const navigate = useNavigate();

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
      Ingyenes szállítás 20.000 Ft felett! 🚚 Az első vásárlás leadásakor 10% kedvezmény!
    </Box>
    <Box
      style={{
        position: 'fixed',
        top: 34,
        left: 0,
        right: 0,
        height: rem(60),
        backgroundColor: theme.colors.white ? theme.colors.white[0] : '#ffffff',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Container size="xl" style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
        {/* Logó */}
        <Box style={{ fontSize: rem(24), fontWeight: 700, color: theme.colors.green?.[7] || 'green', marginRight: rem(20), cursor: 'pointer' }} onClick={() => navigate('/')}>
          Globify
        </Box>

        {/* Keresőmező */}
        <Box style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Box style={{ width: '60%' }}>
            <SearchBar />
          </Box>
        </Box>

        {/* Jobb oldali ikonok */}
        <Box style={{ display: 'flex', alignItems: 'center', gap: rem(16) }}>
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
