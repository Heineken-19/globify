import {
    Modal,
    TextInput,
    Textarea,
    Button,
    Group,
    Stack,
    Text,
    Loader,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useState, useEffect } from "react";
import { IconUpload } from "@tabler/icons-react";
import { useCreateNewsletterTemplate, useUpdateNewsletterTemplate } from "../../hooks/admin/useAdminNewsletter";
import { NewsletterTemplate } from "../../services/admin/AdminNewsletterService";
import api from "../../services/api";
import { useModal } from "../../context/ModalContext";

interface Props {
    opened: boolean;
    onClose: () => void;
    template?: NewsletterTemplate | null;
}

const AdminNewsletterModal = ({ opened, onClose, template }: Props) => {
    const isEdit = Boolean(template);

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const createMutation = useCreateNewsletterTemplate();
    const updateMutation = useUpdateNewsletterTemplate();
    const { setModalOpen } = useModal();

    useEffect(() => {
        setModalOpen(opened); // amikor nyitva van, állítsd be
      }, [opened]);
      
    useEffect(() => {
        if (template) {
          setSubject(template.subject);
          setMessage(template.message);
      
          // Ez a kulcs:
          const parsedImages =
            typeof template.imageUrls === "string"
              ? template.imageUrls.split(",")
              : Array.isArray(template.imageUrls)
              ? template.imageUrls
              : [];
      
          setImageUrls(parsedImages);
        } else {
          setSubject("");
          setMessage("");
          setImageUrls([]);
        }
      }, [template, opened]);

    const handleImageUpload = async (files: File[]) => {
        setUploading(true);
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        try {
            const res = await api.post<string[]>(
                "/api/uploads/newsletter",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setImageUrls((prev) => [...prev, ...res.data]);
        } catch (err) {
            console.error("Feltöltési hiba:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = () => {
        if (!subject || !message) return;

        if (isEdit && template) {
            const updates: Partial<{ subject: string; message: string; imageUrls: string[]; }> = {};
            if (subject !== template.subject) updates.subject = subject;
            if (message !== template.message) updates.message = message;
            if (JSON.stringify(imageUrls) !== JSON.stringify(template.imageUrls))
                updates.imageUrls = imageUrls;

            if (Object.keys(updates).length === 0) {
                onClose();
                return; // nincs változás
            }

            updateMutation.mutate(
                { id: template.id, data: updates },
                { onSuccess: onClose }
            );
        } else {
            createMutation.mutate({ subject, message, imageUrls }, { onSuccess: onClose });
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={isEdit ? "Hírlevél szerkesztése" : "Új hírlevél sablon"}
            centered
        >
            <Stack>
                <TextInput
                    label="Tárgy"
                    value={subject}
                    onChange={(e) => setSubject(e.currentTarget.value)}
                />
                <Textarea
                    label="Üzenet"
                    placeholder="Hírlevél szövege..."
                    value={message}
                    minRows={5}
                    autosize
                    onChange={(e) => setMessage(e.currentTarget.value)}
                />
                <Text size="sm" fw={500}>
                    Képfeltöltés (max 5 kép)
                </Text>
                <Dropzone
                    onDrop={handleImageUpload}
                    accept={IMAGE_MIME_TYPE}
                    maxSize={5 * 1024 ** 2}
                    multiple
                    maxFiles={5 - imageUrls.length}
                >
                    <Group justify="center" gap="xs">
                        <IconUpload size={20} />
                        <Text>Kattints vagy húzd ide a képeket</Text>
                    </Group>
                </Dropzone>

                {uploading && <Loader size="sm" color="blue" mt="xs" />}

                <Group wrap="wrap" mt="xs">
                    {imageUrls.map((url) => (
                        <img
                            key={url}
                            src={url}
                            alt="Feltöltött kép"
                            style={{
                                width: 100,
                                height: 100,
                                objectFit: "cover",
                                borderRadius: 8,
                            }}
                        />
                    ))}
                </Group>

                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={onClose}>
                        Mégse
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        loading={createMutation.isPending || updateMutation.isPending}
                    >
                        {isEdit ? "Mentés" : "Létrehozás"}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default AdminNewsletterModal;
