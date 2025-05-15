import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput, PasswordInput, Button, Container, Title, Alert } from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

const LoginPage = () => {
  const { handleLogin } = useAuth(); // 🔥 AuthContext-ből jön
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const {showSuccess} = useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // 🔄 Ha módosítjuk a mezőt, töröljük a hibaüzenetet
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const success = await handleLogin(formData.email, formData.password);
      if (success) {
        showSuccess("Sikeres bejelentkezés!")
        navigate("/"); 
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container size={420} style={{ marginTop: 40 }}>
      <Title style={{ textAlign: "center" }}>Bejelentkezés</Title>

      {/* 🔴 Hibaüzenet megjelenítése */}
      {error && (
        <Alert color="red" style={{ marginBottom: "10px" }}>
          {error}
        </Alert>
      )}

      {/* ✅ Bejelentkezési űrlap */}
      <form onSubmit={handleSubmit}>
        <TextInput
          label="E-mail"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ marginBottom: "10px" }}
        />
        <PasswordInput
          label="Jelszó"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ marginBottom: "10px" }}
        />
        <Button
          type="submit"
          fullWidth
          color="green"
          style={{ marginTop: "10px" }}
        >
          Bejelentkezés
        </Button>
      </form>

      {/* ✅ Ha még nincs fiók */}
      <Button
        variant="default"
        fullWidth
        onClick={() => navigate("/register")}
        style={{ marginTop: "10px" }}
      >
        Nincs még fiókod? Regisztráció
      </Button>
    </Container>
  );
};

export default LoginPage;
