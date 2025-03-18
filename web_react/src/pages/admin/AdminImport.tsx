import { useState } from "react";
import { Button, FileInput, Alert, Loader, Container } from "@mantine/core";
import { useAdminImport } from "../../hooks/admin/useAdminImport";
import AdminBar from "./AdminBar";

export default function AdminImport() {
  const [file, setFile] = useState<File | null>(null);
  const { handleImport, loading, error, success } = useAdminImport();

  const onSubmit = async () => {
    if (file) {
      await handleImport(file);
    }
  };

  return (
            <Container size="xl" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
              <AdminBar />
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}>
      <h2>Termékek Importálása</h2>

      {error && <Alert color="red">{error}</Alert>}
      {success && <Alert color="green">{success}</Alert>}

      <FileInput
        label="Excel fájl kiválasztása"
        placeholder="Fájl feltöltése"
        accept=".xls,.xlsx"
        onChange={(file) => setFile(file)}
      />

      <Button
        style={{ marginTop: "1rem" }}
        onClick={onSubmit}
        disabled={loading || !file}
      >
        {loading ? <Loader size="sm" /> : "Importálás"}
      </Button>
    </div>
    </Container>
  );
}
