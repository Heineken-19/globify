import React, { useEffect, useState } from 'react';
import { Container, Title, Text, Card, Group, Image, Button, Badge, Flex, Chip } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    imageUrl: string;
    blogCategory: string;
    highlighted: boolean;
    author: string;
}

export default function BlogListPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await api.get('/api/blogposts');
            setBlogs(response.data);
            setFilteredBlogs(response.data);

            const uniqueCategories = Array.from(
                new Set(response.data.map((blog: BlogPost) => blog.blogCategory))
            ) as string[]; // 🔹 Explicit string[] típus

            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Hiba a blogok betöltésekor:', error);
        }
    };

    const handleCategorySelect = (category: string | null) => {
        setSelectedCategory(category);
        if (category) {
            setFilteredBlogs(blogs.filter((blog) => blog.blogCategory === category));
        } else {
            setFilteredBlogs(blogs); // 🔹 Minden blog visszaállítása
        }
    };

    return (
        <Container size="lg" pt="md">
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
                {selectedCategory === null ? "Minden cikk" : selectedCategory}
            </h1>
            <Group mb="md" gap="xs">
                <Chip
                    checked={selectedCategory === null}
                    onClick={() => handleCategorySelect(null)}
                    color="green"
                >
                    Minden kategória
                </Chip>
                {categories.map((category) => (
                    <Chip
                        key={category}
                        checked={selectedCategory === category}
                        onClick={() => handleCategorySelect(category)}
                        color="green"
                    >
                        {category}
                    </Chip>
                ))}
            </Group>
            <Flex direction="column" gap="md">
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                        <Card key={blog.id} shadow="sm" p="lg" radius="md" withBorder>
                            <Flex align="center" justify="space-between" wrap="nowrap">
                                <Image src={blog.imageUrl} alt={blog.title} width={150} height={100} fit="cover" radius="md" />
                                <div style={{ flex: 1, marginLeft: '1rem' }}>
                                    <Flex direction="column" style={{ height: "100%" }}>
                                        {blog.highlighted && <Badge color="yellow" variant="filled">Kiemelt</Badge>}
                                        <Title order={3}>{blog.title}</Title>
                                        <Text size="sm" color="dimmed" style={{ flexGrow: 1 }}>{blog.description}</Text>
                                        <Text size="xs" color="gray">Szerző: {blog.author}</Text>
                                    </Flex>
                                </div>
                                <Button
                                    variant="light"
                                    onClick={() => navigate(`/blog/${blog.slug}`)}
                                    style={{ alignSelf: "flex-start" }}
                                >
                                    Cikk megnyitása
                                </Button>
                            </Flex>
                        </Card>
                    ))
                ) : (
                    <Text color="dimmed">Nincs elérhető blog a kiválasztott kategóriában.</Text>
                )}
            </Flex>
        </Container>
    );
}