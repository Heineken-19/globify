import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, Box, rem, Loader, Avatar, Paper, Group, Image, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import api from '../../services/api';
import { Product } from '../../types';
import { API_URL } from '../../config/config';

interface SearchBarMobileProps {
    searchOpen: boolean;
    setSearchOpen: (open: boolean) => void;
}

export default function SearchBarMobile({ searchOpen, setSearchOpen }: SearchBarMobileProps) {
    const [inputValue, setInputValue] = useState("");
    const [debounced] = useDebouncedValue(inputValue, 300);
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
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
            setSearchOpen(false);
        } else {
            navigate("/products");
        }
    };

    const toggleSearch = () => setSearchOpen(!searchOpen);

    const handleSelectProduct = (slug: string) => {
        navigate(`/products/${slug}`);
        setSearchOpen(false);
    };

    return (
        <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
                radius="xl"
                onClick={toggleSearch}
                style={{
                    marginLeft: rem(10),
                    width: rem(30),
                    height: rem(30),
                    cursor: "pointer",
                    opacity: 1,
                }}
            >
                <IconSearch size={18} color="#000" />
            </Avatar>

            {searchOpen && (
                <Box
                    style={{
                        position: 'fixed',
                        top: rem(85),
                        left: 10,
                        right: 10,
                        padding: rem(2),
                        backgroundColor: 'white',
                        zIndex: 1000
                    }}
                >
                    <TextInput
                        placeholder="Keresés..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        size="xs"
                        rightSection={loading ? <Loader size="xs" /> : <IconSearch size={18} onClick={handleSearch} />}
                    />

                    {results.length > 0 && (
                        <Paper style={{ marginTop: rem(4), padding: rem(4), borderRadius: rem(8) }}>
                            {results.map((product) => (
                                <Group
                                    key={product.id}
                                    onClick={() => handleSelectProduct(product.slug)}
                                    style={{ cursor: "pointer", padding: rem(4), alignItems: "center" }}
                                >
                                    <Image
                                        src={product.imageUrls?.[0] ? `${API_URL}/uploads/products/${product.imageUrls[0]}` : `${API_URL}/uploads/products/default.jpg`}
                                        width={40}
                                        height={40}
                                        radius="sm"
                                        fit="cover"
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
            )}
        </Box>
    );
}
