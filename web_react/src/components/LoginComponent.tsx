import { Avatar, Popover, Paper, Text, Divider, Button, TextInput, rem } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useDropdown } from "../context/DropdownContext";
import { useNotification } from "../context/NotificationContext";

export default function LoginComponent() {
  const { isLoggedIn, handleLogin, handleLogout, userRole } = useAuth();
  const { openDropdown, setOpenDropdown } = useDropdown();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await handleLogin(loginData.email, loginData.password);

      // ✅ Sikeres bejelentkezés esetén értesítés
      showSuccess("Sikeres bejelentkezés!");

      setOpenDropdown(null); // Bezárjuk a popovert
    } catch (error) {
      // ✅ Sikertelen bejelentkezés esetén értesítés
      showError("Sikertelen bejelentkezés.");
      console.error("Bejelentkezési hiba:", error);
    }
  };

  const handleOpen = () => {
    if (openDropdown === "login") {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(null);
      setTimeout(() => setOpenDropdown("login"), 10);
    }
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
    // ✅ Sikeres kijelentkezés esetén értesítés
    showSuccess("Sikeresen kijelentkezett!");

    setOpenDropdown(null);
  };

  const menuItems = [
    { label: "Profilom", path: "/profile" },
    { label: "Rendeléseim", path: "/profile/orders" },
    ...(userRole === "ADMIN" ? [{ label: "Admin", path: "/admin" }] : []),
    { label: "Kijelentkezés", action: handleLogoutClick, color: "red" },
  ];

  return (
    <>
      <Popover opened={openDropdown === "login"} onClose={() => setOpenDropdown(null)} position="bottom-end" offset={10} withArrow shadow="md" zIndex={1100} withinPortal={false}  trapFocus={false}>
        <Popover.Target>
          <Avatar radius="xl" onClick={handleOpen} style={{ cursor: "pointer",  marginLeft: rem(150)  }}>
            <IconUser size={24} color="#000000" />
          </Avatar>
        </Popover.Target>

        <Popover.Dropdown>
          {isLoggedIn ? (
            <Paper p={1} style={{ width: rem(200), borderRadius: rem(12), background: "#fff", paddingTop: rem(10), paddingBottom: rem(10)
             }}>
              <Text fw={700} style={{ textAlign: "center" }}>Hello, Sütő Olivér </Text>
              <Divider my="xs" />
              <div style={{ display: "flex", flexDirection: "column", gap: rem(8) }}>
                {menuItems.map((item, idx) => (
                  <div key={idx}>
                    {item.label === "Kijelentkezés" && <Divider my="xs" />}
                    <div
                      onClick={() => {
                        if (item.path) navigate(item.path);
                        if (item.action) item.action();
                        setOpenDropdown(null);
                      }}
                      style={{
                        padding: `${rem(3)} ${rem(15)}`,
                        borderRadius: rem(10),
                        cursor: "pointer",
                        color: item.color || "black",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </Paper>
          ) : (
            <Paper p="sm"  style={{ width: rem(250), background: "#fff", display: "flex", flexDirection: "column" }}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <TextInput
                  label="Email:"
                  placeholder=""
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  withAsterisk
                  style={{ width: "100%" }}
                />
                <TextInput
                  label="Jelszó:"
                  type="password"
                  placeholder=""
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  withAsterisk
                  style={{ width: "100%" }}
                  mt="sm"
                />
                <Button p={0} component={Link} to="/forgot-password" variant="subtle" size="xs" style={{ color: "#88BB8A", alignSelf: "flex-start", background: "none", textDecoration: "none", fontWeight: "bold" }}>Elfelejtettem a jelszavam</Button>
                <Button fullWidth  color="green" radius="md" type="submit">Belépés</Button>
                </form>
              <Divider  my="xl" />
              
              <Button p={0} m={0} component={Link} to="/register" variant="subtle" style={{ alignSelf: "flex-start", color: "#88BB8A", textDecoration: "none", fontWeight: "bold" }}>Regisztráció</Button>
            </Paper>
            
          )}
        </Popover.Dropdown>
      </Popover>

    </>
  );
}
