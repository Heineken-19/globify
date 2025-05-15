import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Title, Card, Text, SimpleGrid, Badge, Button, Group } from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import api from "../services/api";

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    description: string;
    highlighted: boolean;
    createdAt: string;
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await api.get<BlogPost[]>("/api/blogposts");
            setPosts(response.data);
        } catch (error) {
            console.error("Hiba a blogcikkek lekérésekor:", error);
        }
    };

    return (
        <Container size="xl" pt="md">
            <Title order={2} mb="xl">Blog</Title>

            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
                {posts.map((post) => (
                    <Card key={post.id} shadow="md" padding="lg" withBorder style={{ borderColor: post.highlighted ? "#16b040" : undefined }}>
                        <Group justify="space-between" mb="sm">
                            <Title order={4}>{post.title}</Title>
                            {post.highlighted && (
                                <Badge color="green" leftSection={<IconStarFilled size={12} />}>
                                    Kiemelt
                                </Badge>
                            )}
                        </Group>
                        <Text size="sm" mt="xs" lineClamp={3}>
                            {post.description}
                        </Text>
                        <Button
                            fullWidth
                            mt="md"
                            onClick={() => navigate(`/blog/${post.slug}`)}
                        >
                            Olvasás
                        </Button>
                    </Card>
                ))}
            </SimpleGrid>
        </Container>
    );
}
