import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { TextInput, Textarea, Button, Switch, Container, Group, Title, rem } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BlogImageUpload from "./BlogImageUpload";
import api from "../../services/api";
import { useNotification } from "../../context/NotificationContext";

interface BlogPostRequest {
    id?: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    imageUrl: string;
    blogCategory: string;
    highlighted: boolean;
    author: string;
}

export default function AdminBlogEditor() {
    const { slug } = useParams();
    const isEditing = slug !== undefined && slug !== "new";
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<BlogPostRequest | null>(null);
    const { showSuccess, showError } = useNotification();
    const [loading, setLoading] = useState(false);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize('NFD')                         // ékezetek szétbontása
            .replace(/[\u0300-\u036f]/g, '')           // ékezetek eltávolítása
            .replace(/[^a-z0-9\s-]/g, '')              // nem betű/szám karakterek eltávolítása
            .trim()
            .replace(/\s+/g, '-')                      // szóköz helyett kötőjel
            .replace(/-+/g, '-');                      // több kötőjelből egy
    };

    const form = useForm<BlogPostRequest>({
        initialValues: {
            title: "",
            slug: "",
            description: "",
            content: "",
            imageUrl: "",
            blogCategory: "",
            highlighted: false,
            author: "",
        },
        validate: {
            title: (value) => value.trim().length === 0 ? "A cím nem lehet üres" : null
        }
    });

    const editor = useEditor({
        extensions: [StarterKit],
        content: form.values.content,
        onUpdate: ({ editor }) => {
            form.setFieldValue("content", editor.getHTML());
        },
    });

    useEffect(() => {
        if (isEditing) {
            fetchBlogPost(slug!);
        }
    }, [slug]);

    const fetchBlogPost = async (slugOrId: string) => {
        try {
            const response = await api.get(`/api/blogposts/${slugOrId}`);
            form.setValues(response.data);
            editor?.commands.setContent(response.data.content); // Tartalom betöltése az editorba
            setInitialValues(response.data);
        } catch (error) {
            console.error("Hiba a blogcikk betöltésekor:", error);
        }
    };

    const handleSubmit = async (values: BlogPostRequest) => {
        setLoading(true);
        try {
            if (!values.title || values.title.trim() === "") {
                showError("A cím nem lehet üres!");
                return;
            }

            const requestData = { ...values };
            if (!requestData.slug || requestData.slug.trim() === "") {
                requestData.slug = generateSlug(requestData.title);
            }

            if (isEditing && initialValues?.id) {
                await api.put(`/api/blogposts/${initialValues.id}`, requestData);
            } else {
                await api.post("/api/blogposts", requestData);
            }

            showSuccess("Sikeres mentés!");
            navigate("/admin/blog");
        } catch (error) {
            console.error("Hiba mentéskor:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container size="xl" pt="md">
            <Group mb="md">
                <Button
                    variant="outline"
                    onClick={() => navigate("/admin/blog")}
                >
                    Vissza a cikkekhez
                </Button>
            </Group>
            <Title order={3} mb="md">{isEditing ? "Blogcikk szerkesztése" : "Új blogcikk írása"}</Title>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Group grow mb="md">
                    <TextInput
                        label="Cím"
                        value={form.values.title}
                        onChange={(event) => {
                            const value = event.currentTarget.value;
                            form.setFieldValue("title", value);
                            if (!isEditing) {
                                form.setFieldValue("slug", generateSlug(value));
                            }
                        }}
                        required
                    />
                    <TextInput label="Slug" {...form.getInputProps("slug")} required />
                </Group>

                <Textarea label="Rövid leírás" {...form.getInputProps("description")} mb="md" required />

                <div style={{ marginBottom: "1rem" }}>
                    <label><strong>Tartalom</strong></label>
                    {editor && (
                        <RichTextEditor
                            editor={editor}
                            style={{
                                minHeight: "150px",
                                border: "1px solid #ddd",
                                padding: "0.5rem",
                                borderRadius: "8px"
                            }}>
                            <RichTextEditor.Content />
                        </RichTextEditor>
                    )}
                </div>

                <BlogImageUpload onUploadSuccess={(url) => form.setFieldValue("imageUrl", url)} />

                <Group grow mt="md">
                    <TextInput label="Kategória" {...form.getInputProps("blogCategory")} />
                    <TextInput label="Szerző" {...form.getInputProps("author")} />
                </Group>

                <Switch
                    label="Kiemelt cikk"
                    checked={form.values.highlighted}
                    onChange={(event) => form.setFieldValue("highlighted", event.currentTarget.checked)}
                    style={{ marginTop: rem(16) }}
                />

                <Button type="submit" mt="xl" loading={loading}>
                    Mentés
                </Button>
            </form>
        </Container>
    );
}