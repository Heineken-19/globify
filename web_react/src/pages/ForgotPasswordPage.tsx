import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  TextInput,
  Button,
  Alert,
  Paper,
  Text,
} from "@mantine/core";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { sendPasswordResetEmail } from "../services/AuthService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await sendPasswordResetEmail(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Hiba történt a jelszó-visszaállítás során.");
    }
  };

  return (
    <Container size={420} style={{ marginTop: 40, marginBottom: 40 }}>
      <Title style={{ fontWeight: 700, color: "#2E7D32", textAlign: "center" }}>
        Elfelejtetted a jelszavad?
      </Title>

      <Paper shadow="md" style={{ padding: 30, marginTop: 30 }} radius="md" withBorder>
        {sent ? (
          <Alert icon={<IconCheck size={16} />} color="green">
            ✅ Jelszó-visszaállító email elküldve! Kérjük, ellenőrizd a postaládádat.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" style={{ marginBottom: "10px" }}>
                {error}
              </Alert>
            )}

            <TextInput
              label="Email cím"
              placeholder="pl. valaki@email.hu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              style={{ marginBottom: "1rem" }}
            />

            <Button fullWidth type="submit" color="green">
              Küldés
            </Button>
          </form>
        )}

        {sent && (
          <Text
          size="sm"
          mt="md"
          style={{ cursor: "pointer", color: "#2E7D32", textAlign: "center" }}
          onClick={() => navigate("/login")}
        >
            Vissza a bejelentkezéshez
          </Text>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
