import { Alert, Container, Title, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { verifyEmail } from "../services/AuthService";


export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token || status !== "loading") return;

    const handleVerification = async () => {
      try {
        const response = await verifyEmail(token);
        showSuccess(response.message);
        setStatus("success");

        setTimeout(() => navigate(response.redirectUrl), 800000000);
      } catch (error: any) {
        showError(error.response?.data?.message || "Hiba történt.");
        setStatus("error");
      }
    };

    handleVerification();
  }, [searchParams]);

  return (
    <Container>
      <Title style={{ textAlign: "center" }}>Email Megerősítése</Title>

      {status === "success" && (
        <>
          <Alert color="green">
            ✅ Email címed sikeresen megerősítve! Átirányítunk a bejelentkezési oldalra...
          </Alert>
          <Button
            style={{
              width: "40%",
              display: "block",
              margin: "20px auto",
              justifyContent: "center",
            }}
            color="green"
            onClick={() => navigate("/login")}
          >
            Bejelentkezés
          </Button>
        </>
      )}

      {status === "error" && (
        <Alert color="red">
          ❌ Érvénytelen vagy lejárt megerősítő link. Kérjük, fordulj az ügyfélszolgálathoz.
        </Alert>
      )}
    </Container>
  );
}
