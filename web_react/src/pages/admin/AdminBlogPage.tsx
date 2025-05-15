import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Table, Button, Group, Text, Container, Title, ActionIcon, Badge } from "@mantine/core";
import { IconPencil, IconTrash, IconPlus } from "@tabler/icons-react";
import api from "../../services/api";

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    description: string;
    highlighted: boolean;
    createdAt: string;
    author: string;
}

export default function AdminBlogPage() {
    const navigate = useNavigate();
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const fetchBlogPosts = async () => {
        try {
            const response = await api.get<BlogPost[]>("/api/blogposts");
            setBlogPosts(response.data);
        } catch (error) {
            console.error("Hiba a blogcikkek lekérésekor:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Biztosan törölni szeretnéd a cikket?")) return;
        try {
            await api.delete(`/api/blogposts/${id}`);
            fetchBlogPosts();
        } catch (error) {
            console.error("Hiba a cikk törlésekor:", error);
        }
    };

    return (
        <Container size="xl" pt="md">
            <Group justify="space-between" mb="md">
                <Title order={3}>Blog cikkek kezelése</Title>
                <Button
                    component={Link}
                    to="/admin/blog/new"
                    leftSection={<IconPlus size={18} />}
                >
                    Új cikk írása
                </Button>
            </Group>

            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Cím</Table.Th>
                        <Table.Th>Rövid leírás</Table.Th>
                        <Table.Th>Kiemelt</Table.Th>
                        <Table.Th>Létrehozva</Table.Th>
                        <Table.Th>Létrehozó</Table.Th>
                        <Table.Th>Akciók</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {blogPosts.map((post) => (
                        <Table.Tr key={post.id} className="hover:bg-gray-100 transition-colors">
                            <Table.Td>{post.title}</Table.Td>
                            <Table.Td>
                                <Text lineClamp={2}>{post.description}</Text>
                            </Table.Td>
                            <Table.Td>
                                {post.highlighted ? <Badge color="green">Igen</Badge> : <Badge color="gray">Nem</Badge>}
                            </Table.Td>
                            <Table.Td>{new Date(post.createdAt).toLocaleDateString()}</Table.Td>
                            <Table.Td>{post.author}</Table.Td>
                            <Table.Td>
                                <Group gap="xs">
                                    <ActionIcon color="blue" onClick={() => navigate(`/admin/blog/${post.slug}`)}>
                                        <IconPencil size={16} />
                                    </ActionIcon>
                                    <ActionIcon color="red" onClick={() => handleDelete(post.id)}>
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Container>
    );
}
