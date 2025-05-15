import { useState } from "react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Stack, Text, Button, Image, rem, Group } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import api from "../../services/api";

interface BlogImageUploadProps {
  onUploadSuccess: (url: string) => void;
}

export default function BlogImageUpload({ onUploadSuccess }: BlogImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await api.post<string[]>("/api/uploads/blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const [url] = response.data;
      setPreview(url);
      onUploadSuccess(url);
    } catch (error) {
      console.error("Hiba a kép feltöltésekor:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Stack gap="md">
      {preview ? (
        <Image src={preview} alt="Feltöltött kép" width={200} />
      ) : (
        <Dropzone
          onDrop={handleDrop}
          onReject={(files) => console.log("Rejected files:", files)}
          maxSize={5 * 1024 ** 2} // max 5MB
          accept={IMAGE_MIME_TYPE}
          multiple={false}
        >
          <Group justify="center" style={{ minHeight: rem(100), pointerEvents: uploading ? "none" : "auto" }}>
            <Dropzone.Accept>
              <IconUpload size="2rem" />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size="2rem" />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size="2rem" />
            </Dropzone.Idle>
            <Text size="sm">Húzd ide a képet, vagy kattints a feltöltéshez</Text>
          </Group>
        </Dropzone>
      )}
      {preview && (
        <Button variant="light" color="red" size="xs" onClick={() => setPreview(null)}>
          Kép eltávolítása
        </Button>
      )}
    </Stack>
  );
}
