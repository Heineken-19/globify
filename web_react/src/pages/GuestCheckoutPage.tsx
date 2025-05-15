import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput, Button, Container, Paper, Text, Title, Alert } from "@mantine/core";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { sendGuestCheckoutLink } from "../services/AuthService";

export default function GuestCheckoutPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      await sendGuestCheckoutLink(email);
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setError(err.response?.data || "Hiba történt a link kiküldése során.");
    }
  };

  return (
    <Container size={420} style={{ marginTop: 40, marginBottom: 40 }}>
      <Title style={{ fontWeight: 700, color: "#2E7D32", textAlign: "center" }}>
      Vásárlás vendégként
      </Title>

      <Paper withBorder shadow="md" p="lg" radius="md">
        {status === "success" ? (
          <Alert icon={<IconCheck size={16} />} color="green">
            A belépési linket elküldtük az <b>{email}</b> címre! 📧<br />
            Kérlek, ellenőrizd az emailjeidet, és kattints a linkre a kosár eléréséhez.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            {status === "error" && error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
                {error}
              </Alert>
            )}
            <Text mb="xs">Add meg az email címedet, ahová elküldhetjük a kosarad visszaállításához szükséges linket:</Text>
            <TextInput
              label="Email cím"
              placeholder="pelda@email.hu"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              mb="md"
            />
            <Button type="submit" fullWidth loading={status === "loading"} color="green">
              Folytatás
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
}
