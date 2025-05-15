import { Box, Button, Container, Text, Textarea, TextInput, rem } from "@mantine/core";
import { useState } from "react";
import { useContact } from "../hooks/useContact";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const contactMutation = useContact();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData, {
      onSuccess: () => {
        setSuccessMessage("Üzenet sikeresen elküldve!");
        setFormData({ name: "", email: "", message: "" });
      },
      onError: () => {
        setSuccessMessage("Hiba történt az üzenet küldésekor. Kérlek, próbáld újra később.");
      },
    });
  };

  return (
    <Container size="md" mt="xl">
      <Text size="xl" fw={700} mb="md">
        Kapcsolatfelvétel
      </Text>
      {successMessage && (
        <Text color={successMessage.includes("sikeresen") ? "green" : "red"} mb="md">
          {successMessage}
        </Text>
      )}
      <Box component="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: rem(16) }}>
        <TextInput
          label="Név"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          withAsterisk
        />
        <TextInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          withAsterisk
        />
        <Textarea
          label="Üzenet"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          withAsterisk
          minRows={5}
        />
        <Button type="submit" color="green" size="md" loading={contactMutation.isPending}>
          Küldés
        </Button>
      </Box>
    </Container>
  );
}
