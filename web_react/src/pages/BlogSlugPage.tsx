import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Title, Text, Image, Button, Group } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import api from "../services/api";

interface BlogPost {
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

export default function BlogSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await api.get<BlogPost>(`/api/blogposts/${slug}`);
      setPost(response.data);
    } catch (error) {
      console.error("Hiba a blogcikk betöltésekor:", error);
    }
  };

  if (!post) {
    return null;
  }

  return (
    <Container size="md" pt="md">
              <Group mb="md">
        <Button variant="outline" onClick={() => navigate("/blog")} leftSection={<IconArrowLeft size={18} />}>
          Vissza a cikkekre
        </Button>
      </Group>
      <Title order={1} mb="md">{post.title}</Title>
      {post.imageUrl && (
        <Image src={post.imageUrl} alt={post.title} radius="md" mb="md" />
      )}
      <Text size="sm" color="dimmed" mb="md">
        {new Date(post.createdAt).toLocaleDateString()}
      </Text>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </Container>
  );
}
