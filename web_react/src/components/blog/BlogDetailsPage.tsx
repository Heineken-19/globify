import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Text, Image, Badge, Button, Stack } from '@mantine/core';
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

export default function BlogDetailsPage() {
    const { slug } = useParams<{ slug: string }>();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlog();
    }, [slug]);

const fetchBlog = async () => {
    try {
        const response = await api.get(`/api/blogposts/slug/${slug}`);
        setBlog(response.data);
    } catch (error) {
        console.error('Hiba a blog betöltésekor:', error);
    }
};

    if (!blog) {
        return <Container><Text>Betöltés...</Text></Container>;
    }

    return (
        <Container size="lg" pt="md">
            <Stack gap="md">
                {blog.highlighted && <Badge color="yellow" variant="filled">Kiemelt</Badge>}
                <Title>{blog.title}</Title>
                <Text color="dimmed">Szerző: {blog.author} | Kategória: {blog.blogCategory}</Text>
                <Image src={blog.imageUrl} alt={blog.title} radius="md" />
                <Text dangerouslySetInnerHTML={{ __html: blog.content }}></Text>
                <Button variant="outline" onClick={() => navigate('/blog')}>Vissza a blogokhoz</Button>
            </Stack>
        </Container>
    );
}
