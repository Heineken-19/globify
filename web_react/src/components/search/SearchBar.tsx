import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, Box, rem, Paper, Image, Text, Group, Loader } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useMediaQuery, useDebouncedValue } from '@mantine/hooks';
import api from '../../services/api';
import { Product } from '../../types';
import { API_URL } from '../../config/config';

export default function SearchBar() {
  const [inputValue, setInputValue] = useState("");
  const [debounced] = useDebouncedValue(inputValue, 300);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  useEffect(() => {
    if (debounced.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    api
      .get("/api/products", { params: { searchTerm: debounced, size: 5, page: 0 } })
      .then((res) => setResults(res.data.content || []))
      .finally(() => setLoading(false));
  }, [debounced]);

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      navigate(`/products?search=${inputValue.trim()}`);
      setResults([]);
    } else {
      navigate("/products");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleSelectProduct = (slug: string) => {
    navigate(`/products/${slug}`);
    setInputValue("");
    setResults([]);
  };

  return (
    <Box
      style={{
        position: "relative",
        width: isMobile ? rem(160) : rem(390),
        marginLeft:rem(70),
      }}
    >
      <TextInput
        placeholder="Keresés..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        radius="md"
        size={isMobile ? "xs" : "md"}
        rightSection={loading ? <Loader size="xs" /> : <IconSearch style={{ cursor: 'pointer' }} onClick={handleSearch} />}
        styles={{
          input: {
            backgroundColor: "#F3F4F6",
            borderRadius: rem(8),
            border: "1px solid #ccc",
            paddingLeft: rem(12),
            paddingRight: rem(40),
            fontSize: isMobile ? rem(12) : rem(14),
            color: "#333",
          },
        }}
      />

      {results.length > 0 && (
        <Paper shadow="sm" radius="md" withBorder style={{ position: "absolute", zIndex: 10, width: "100%", marginTop: rem(5) }}>
          {results.map((product) => (
            <Group
              key={product.id}
              p="xs"
              gap="sm"
              style={{ cursor: "pointer" }}
              onClick={() => handleSelectProduct(product.slug)}
            >
              <Image src={product.imageUrls?.length > 0 ? `${API_URL}/uploads/products/${product.imageUrls[0]}` : `${API_URL}/uploads/products/default.jpg`}
                width={40}
                height={40}
                fit="cover"
                radius="sm"
              />
              <div>
                <Text size="sm" fw={500}>{product.name}</Text>
                <Text size="xs" color="dimmed">{product.price?.toLocaleString("hu-HU")} Ft</Text>
              </div>
            </Group>
          ))}
        </Paper>
      )}
    </Box>
  );
}
