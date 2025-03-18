import { useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { TextInput, PasswordInput, Button, Container, Title, Alert, Paper, Group, Divider } from "@mantine/core";
import { IconBrandGoogle, IconBrandFacebook } from "@tabler/icons-react";


export default function RegisterPage() {
  const { handleRegister, loading, error, success } = useRegister();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleRegister(formData.email, formData.password);
  };

  return (
    <Container size={420} style={{ marginTop: 40, marginBottom: 40 }}>
      <Title  style={{ fontWeight: 700, color: "#2E7D32", textAlign:"center" }}>Regisztráció</Title>
      <Paper shadow="md"style={{ padding: 30, marginTop: 30 }} radius="md" withBorder>
        {error && <Alert color="red">{error}</Alert>}
        {success && <Alert color="green">Sikeres regisztráció! Kérjük, erősítsd meg az e-mailed.</Alert>}
        <form onSubmit={handleSubmit}>
          <TextInput placeholder="Email" name="email" type="email" value={formData.email} onChange={handleChange} style={{ marginBottom: "0.5rem" }} />
          <PasswordInput placeholder="Jelszó" name="password" value={formData.password} onChange={handleChange} required style={{ marginBottom: "1rem" }} />
          <Button type="submit" fullWidth style={{ marginTop: "md" }} loading={loading} color="green">Regisztráció</Button>
        </form>
        <Divider label="vagy" labelPosition="center" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }} />
        <Group grow style={{ marginBottom: "xl", marginTop: "md" }}>
          <Button variant="default" leftSection={<IconBrandGoogle size={16} />}>Google</Button>
          <Button variant="default" leftSection={<IconBrandFacebook size={16} />}>Facebook</Button>
        </Group>
      </Paper>
    </Container>
  );
}
