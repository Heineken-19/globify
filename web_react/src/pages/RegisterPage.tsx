import { useState, useEffect } from "react";
import { useRegister } from "../hooks/useRegister";
import { useNavigate } from "react-router-dom";
import { TextInput, PasswordInput, Button, Container, Title, Alert, Paper, Group, Divider, Text } from "@mantine/core";
import { IconBrandGoogle, IconBrandFacebook } from "@tabler/icons-react";
import { validatePassword } from "../utils/validators";


export default function RegisterPage() {
  const { handleRegister, loading, error, success } = useRegister();
  const [formData, setFormData] = useState({ email: "", password: "", referralCode: "" });
  const [showReferral, setShowReferral] = useState(false);
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const referralCodeFromUrl = params.get("ref");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (referralCodeFromUrl) {
      setFormData((prev) => ({ ...prev, referralCode: referralCodeFromUrl }));
    }
  }, [referralCodeFromUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationMessage = validatePassword(formData.password);
    if (validationMessage) {
      setPasswordError(validationMessage);
      return;
    }

    setPasswordError(null);

    try {
      await handleRegister(formData.email, formData.password, formData.referralCode);
      if (success) {
      }
    } catch (err: any) {

    }
  };

  return (
    <Container size={420} style={{ marginTop: 40, marginBottom: 40 }}>
      <Title style={{ fontWeight: 700, color: "#2E7D32", textAlign: "center" }}>
        {success ? "Sikeres regisztráció!" : "Regisztráció"}
      </Title>

      <Paper shadow="md" style={{ padding: 30, marginTop: 30 }} radius="md" withBorder>
        {error && (
          <Alert color="red" style={{ marginBottom: "10px" }}>
            {error}
          </Alert>
        )}

        {/* ✅ Ha sikeres a regisztráció, akkor csak az üzenet jelenik meg */}
        {success ? (
          <Alert color="green">
            ✅ Sikeres regisztráció! Kérjük, erősítse meg az emailcímét. <br />
            📧 Emailt kiküldtük a megadott emailcímre.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextInput
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              style={{ marginBottom: "0.5rem" }}
              required
            />
            <PasswordInput
              placeholder="Jelszó"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ marginBottom: "1rem" }}
            />
            {passwordError && (
              <Text size="sm" color="red" style={{ marginBottom: "0.5rem" }}>
                {passwordError}
              </Text>
            )}
            {!showReferral && (
              <Text
                onClick={() => setShowReferral(true)}
                color="green"
                size="sm"
                style={{ cursor: "pointer", marginBottom: "10px" }}
              >
                Van meghívó kódod?
              </Text>
            )}

            {showReferral && (
              <TextInput
                placeholder="Meghívó kód (opcionális)"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                style={{ marginBottom: "1rem" }}
              />
            )}
            <Button type="submit" fullWidth style={{ marginTop: "md" }} loading={loading} color="green">
              Regisztráció
            </Button>
          </form>
        )}

        {/* ✅ Elválasztó vonal és Google / Facebook gombok */}
        {!success && (
          <>
            <Divider label="vagy" labelPosition="center" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }} />
            <Group grow style={{ marginBottom: "xl", marginTop: "md" }}>
              <Button
                variant="default"
                leftSection={<IconBrandGoogle size={16} />}
                onClick={() => alert("Google regisztráció folyamatban...")}
              >
                Google
              </Button>
              <Button
                variant="default"
                leftSection={<IconBrandFacebook size={16} />}
                onClick={() => alert("Facebook regisztráció folyamatban...")}
              >
                Facebook
              </Button>
            </Group>
          </>
        )}
      </Paper>
    </Container>
  );
}
