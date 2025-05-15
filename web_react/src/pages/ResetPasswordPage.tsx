import { useState, useEffect } from "react";
import {
  Container,
  Title,
  PasswordInput,
  Button,
  Paper,
  Alert,
  Text,
} from "@mantine/core";
import { useSearchParams, useNavigate } from "react-router-dom";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { resetPassword } from "../services/AuthService";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const t = params.get("token");
    if (t) setToken(t);
    else setError("Hiányzó vagy érvénytelen token.");
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("A két jelszó nem egyezik.");
      return;
    }

    const isValidPassword = newPassword.length >= 6 &&
      /[A-Z]/.test(newPassword) &&
      /[0-9]/.test(newPassword) &&
      /[._\-]/.test(newPassword);

    if (!isValidPassword) {
      setPasswordError("A jelszónak legalább 6 karakteresnek kell lennie, tartalmaznia kell nagybetűt, számot és speciális karaktert (., -, _).");
      return;
    }

    try {
      if (!token) {
        setError("A token nem található.");
        return;
      }
      await resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Hiba történt a jelszó visszaállítása során.");
    }
  };

  return (
    <Container size={420} style={{ marginTop: 40, marginBottom: 40 }}>
      <Title style={{ fontWeight: 700, color: "#2E7D32", textAlign: "center" }}>
        Jelszó visszaállítása
      </Title>

      <Paper shadow="md" p={30} mt={30} radius="md" withBorder>
        {success ? (
          <Alert icon={<IconCheck size={16} />} color="green">
            ✅ Sikeres jelszó módosítás! Jelentkezz be az új jelszavaddal.
            <Text
              mt="sm"
              color="green"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Bejelentkezés
            </Text>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" mb="sm">
                {error}
              </Alert>
            )}
            <PasswordInput
              label="Új jelszó"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              mb="sm"
            />
            <PasswordInput
              label="Jelszó megerősítése"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              mb="sm"
            />
            {passwordError && (
              <Text color="red" size="sm" mb="sm">{passwordError}</Text>
            )}
            <Button fullWidth type="submit" color="green">
              Jelszó mentése
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
}
