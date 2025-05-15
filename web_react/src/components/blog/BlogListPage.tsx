import React, { useEffect, useState } from 'react';
import { Container, Title, Text, Card, Group, Image, Button, Badge, Flex } from '@mantine/core';
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
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await api.get('/api/blogposts');
            setBlogs(response.data);
        } catch (error) {
            console.error('Hiba a blogok betöltésekor:', error);
        }
    };

    return (
        <Container size="lg" pt="md">
            <Title mb="md">Blogok</Title>
            <Flex direction="column" gap="md">
                {blogs.map((blog) => (
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
                ))}
            </Flex>
        </Container>
    );
}
