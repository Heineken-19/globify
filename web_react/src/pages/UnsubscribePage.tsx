import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Text, Loader, Center, Box } from "@mantine/core";
import { useUnsubscribeByToken } from "../hooks/useNewsLetter";

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const unsubscribe = useUnsubscribeByToken();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    unsubscribe.mutate(token, {
      onSuccess: () => setStatus("success"),
      onError: () => setStatus("error"),
    });
  }, []);

  return (
    <Container size="sm" mt="xl">
      <Center>
        <Box>
          {status === "loading" && <Loader color="green" />}
          {status === "success" && (
            <Text ta="center" size="lg" c="green">
              ✅ Sikeresen leiratkoztál a hírlevélről!
            </Text>
          )}
          {status === "error" && (
            <Text ta="center" size="lg" c="red">
              ❌ Érvénytelen vagy lejárt leiratkozási link.
            </Text>
          )}
        </Box>
      </Center>
    </Container>
  );
};

export default UnsubscribePage;
