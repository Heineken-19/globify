import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, Box, rem, Paper, Image, Text, Group, Loader } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useMediaQuery, useDebouncedValue } from '@mantine/hooks';
import api from '../../services/api';
import { Product, BlogPost } from '../../types';
import { API_URL } from '../../config/config';

export default function SearchBar() {
  const [inputValue, setInputValue] = useState("");
  const [debounced] = useDebouncedValue(inputValue, 300);
  const [results, setResults] = useState<(Product | BlogPost)[]>([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  // ✅ Segédfüggvény a típusok ellenőrzésére
  const isProduct = (item: any): item is Product => {
    return 'name' in item && 'imageUrls' in item;
  };

  const isBlog = (item: any): item is BlogPost => {
    return 'title' in item && 'imageUrl' in item;
  };

  useEffect(() => {
    if (debounced.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    Promise.all([
      api.get("/api/products", { params: { searchTerm: debounced, size: 5, page: 0 } }),
      api.get("/api/blogposts/search", { params: { searchTerm: debounced, size: 5, page: 0 } })
    ])
      .then(([productRes, blogRes]) => {
        const products = productRes.data.content || [];
        const blogs = Array.isArray(blogRes.data) ? blogRes.data : [];
        setResults([...products, ...blogs]);
      })
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

  const handleSelectItem = (item: Product | BlogPost) => {
    if (isProduct(item)) {
      navigate(`/products/${item.slug}`);
    } else if (isBlog(item)) {
      navigate(`/blog/${item.slug}`);
    }
    setInputValue("");
    setResults([]);
  };

  return (
    <Box
      style={{
        position: "relative",
        width: isMobile ? rem(160) : rem(390),
        marginLeft: rem(70),
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
      />

      {results.length > 0 && (
        <Paper shadow="sm" radius="md" withBorder style={{ position: "absolute", zIndex: 10, width: "100%", marginTop: rem(5) }}>
          {results.map((item, index) => (
            <Group
              key={index}
              p="xs"
              gap="sm"
              style={{ cursor: "pointer" }}
              onClick={() => handleSelectItem(item)}
            >
              <Image
                src={
                  isProduct(item)
                    ? (item.imageUrls?.[0] ? `${API_URL}/uploads/products/${item.imageUrls[0]}` : `${API_URL}/uploads/products/default.jpg`)
                    : (item.imageUrl ? item.imageUrl : `${API_URL}/uploads/blogs/default.jpg`)
                }
                width={40}
                height={40}
                fit="cover"
                radius="sm"
              />
              <div>
                <Text size="sm" fw={500}>{isProduct(item) ? item.name : item.title}</Text>
                <Text size="xs" color="dimmed">
                  {isProduct(item) ? `${item.price?.toLocaleString("hu-HU")} Ft` : "Blog"}
                </Text>
              </div>
            </Group>
          ))}
        </Paper>
      )}
    </Box>
  );
}
