import { Modal, TextInput, PasswordInput, Button, Divider, Text, Box, rem, Alert } from "@mantine/core";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IconBrandGoogle} from "@tabler/icons-react";
import { useMediaQuery } from '@mantine/hooks';
import { useModal } from "../context/ModalContext";


interface LoginModalProps {
  opened: boolean;
  onClose: () => void;
  setOpenDropdown?: (value: string | null) => void;
}

export default function LoginModal({ opened, onClose }: LoginModalProps) {
    const { handleLogin } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { setModalOpen } = useModal();
    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
      setModalOpen(opened); // amikor nyitva van, állítsd be
    }, [opened]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        try {
          const success = await handleLogin(formData.email, formData.password);
          if (success) {
            navigate("/cart"); 
            onClose();
          }
        } catch (err: any) {
          setError(err.message);
        }
      };



  return (
    <Modal opened={opened} onClose={onClose} size="lg" centered>
       
      <Box style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: rem(20), padding: rem(20) }}>
        
        {/* 🔹 Bejelentkezés */}
        <Box style={{ width: isMobile ? "100%" : "50%" }}>
            
          <Text fw={600} size="lg" mb="md">
            Visszatérő vásárló?
          </Text>
          {error && (
                <Alert color="red" style={{ marginBottom: "10px" }}>
                  {error}
                </Alert>
              )}
          <form onSubmit={handleSubmit}>
          <TextInput
            label="E-mail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            mb="sm"
          />
          <PasswordInput
            label="Jelszó"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            mb="sm"
          />
           <Button type="submit" fullWidth color="green" mt="md">
            Belépés
          </Button>
          </form>
          <Button
            fullWidth
            mt="sm"
            variant="default"
            leftSection={<IconBrandGoogle size={16} />}
            onClick={() => alert("Google bejelentkezés folyamatban...")}
          >
            Google
          </Button>
          <Text
            size="sm"
            mt="sm"
            c="green"
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/forgot-password")}
          >
            Elfelejtettem a jelszavam
          </Text>
        </Box>

        <Divider orientation="vertical" />

        {/* 🔹 Regisztráció */}
        <Box style={{ width: isMobile ? "100%" : "50%" }}>
          <Text fw={600} size="lg" mb="md">
            Új vásárló?
          </Text>
          <Text size="sm" mb="md">
            Regisztráció előnyei:
            <ul>
              <li>Gyorsabb vásárlás</li>
              <li>Rendelés nyomon követése</li>
              <li>Személyre szabott kedvezmények</li>
            </ul>
          </Text>
          <Button fullWidth color="green" mt="md" onClick={() => {onClose();  navigate('/register');}}>
            Regisztráció
          </Button>
          <Button
            fullWidth
            mt="sm"
            color="gray"
            onClick={() => {
              onClose();
              navigate("/guest-checkout");
            }}
          >
            Vásárlás vendégként
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}


