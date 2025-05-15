import { Avatar, Popover, Paper, Text, Divider, Button, TextInput, rem } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useDropdown } from "../context/DropdownContext";
import { useMediaQuery } from '@mantine/hooks';
import { useNotification } from "../context/NotificationContext";
import { useUser } from "../hooks/useUser";




export default function LoginComponent() {
  const { user, isLoggedIn, handleLogin, handleLogout } = useAuth();
  const { firstName, lastName } = useUser();
  const { openDropdown, setOpenDropdown } = useDropdown();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [open, setOpen] = useState(false);
  const { showSuccess, showError, showInfo } = useNotification();
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    console.log("isLoggedIn változás:", isLoggedIn);
    if (isLoggedIn) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const success = await handleLogin(loginData.email, loginData.password);
      if (success) {
        navigate("/profile");
        showSuccess("Sikeres bejelentkezés!");
      }
    } catch (error: any) {
      console.error("Bejelentkezési hiba:", error);
      if (error.message === "EMAIL_NOT_VERIFIED") {
        showInfo(" Az email cím nincs megerősítve! Kérjük, ellenőrizze az emailjét.");
      } else if (error.message === "Hibás email vagy jelszó.") {
        showError(" Hibás bejelentkezési adatok!");
      } else {
        showError(" Bejelentkezés sikertelen. Próbáld újra később.");
      }
    }
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
    setOpenDropdown(null);
  };


  const menuItems = [
    { label: "Profilom", path: "/profile" },
    { label: "Rendeléseim", path: "/profile/orders" },
    { label: "Kedvenceim", path: "/profile/favorites" },
    ...(user?.role === "ADMIN" ? [{ label: "Admin", path: "/admin" }] : []),
    { label: "Kijelentkezés", action: handleLogoutClick, color: "red" },
  ];

  const handleOpen = () => {
    if (location.pathname === "/register") return;
    setOpen((prev) => !prev);
    if (openDropdown === "menu" || openDropdown === "login") {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(isLoggedIn ? "menu" : "login");
    }
  };

  return (
    <>
      <Popover opened={openDropdown === "menu" || openDropdown === "login"} onClose={() => setOpenDropdown(null)} position="bottom-end" offset={10} withArrow shadow="md" zIndex={1100} withinPortal={false} trapFocus={false}>
        <Popover.Target>
          <Avatar radius="xl" onClick={handleOpen}
            style={{
              marginLeft: isMobile ? rem(30) : rem(200),
              width: isMobile ? rem(30) : rem(40),
              height: isMobile ? rem(30) : rem(40),
              cursor: "pointer",
              opacity: 1,
            }}>
            <IconUser size={isMobile ? 18 : 24} color="#000000" />
          </Avatar>
        </Popover.Target>

        <Popover.Dropdown ref={popoverRef}>
          {isLoggedIn && openDropdown === "menu" ? (
            <Paper
              p={1}
              style={{
                width: isMobile ? rem(160) : rem(200),
                borderRadius: rem(8),
                background: "#fff",
                paddingTop: isMobile ? rem(6) : rem(10),
                paddingBottom: isMobile ? rem(6) : rem(10),
              }}>
              <Text fw={700} style={{ fontSize: isMobile ? rem(14) : rem(16), textAlign: "center" }}>
                Hello, {(firstName || lastName) ? `${firstName} ${lastName}` : "Felhasználó"}
              </Text>
              <Divider my="xs" />
              <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? rem(4) : rem(8) }}>
                {menuItems.map((item, idx) => (
                  <div key={`${item.label}-${idx}`} onClick={() => {
                    if (item.path) navigate(item.path);
                    if (item.action) item.action();
                    setOpenDropdown(null);
                  }}>
                    {item.label === "Kijelentkezés" && <Divider my="xs" />}
                    <div
                      onClick={() => {
                        if (item.path) navigate(item.path);
                        if (item.action) item.action();
                        setOpenDropdown(null);
                      }}
                      style={{
                        padding: isMobile ? `${rem(2)} ${rem(10)}` : `${rem(3)} ${rem(15)}`,
                        borderRadius: rem(10),
                        cursor: "pointer",
                        color: item.color || "black",
                        fontSize: isMobile ? rem(14) : rem(16),
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
            <Paper p="sm" style={{ width: rem(250), background: "#fff", display: "flex", flexDirection: "column" }}>
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
                <Button p={0} component={Link} to="/forgot-password" variant="subtle" size="xs" style={{ color: "#88BB8A", alignSelf: "flex-start", background: "none", textDecoration: "none", fontWeight: "bold" }} onClick={() => setOpenDropdown(null)}>Elfelejtettem a jelszavam</Button>
                <Button fullWidth color="green" radius="md" type="submit" >Bejelentkezés</Button>
              </form>
              <Divider my="xl" />

              <Button p={0} m={0} component={Link} to="/register" variant="subtle" style={{ alignSelf: "flex-start", color: "#88BB8A", textDecoration: "none", fontWeight: "bold" }} onClick={() => setOpenDropdown(null)}>Regisztráció</Button>
            </Paper>

          )}
        </Popover.Dropdown>
      </Popover>

    </>
  );
}
