import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Container, Title, Tabs } from "@mantine/core";

export default function AdminBar() {
    const location = useLocation();
    const navigate = useNavigate();

    const currentTab = location.pathname === "/profile" ? "profile" : location.pathname.split("/profile/")[1];

return (
    <Container size="xl" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
      <Title order={2} style={{ marginBottom: "20px" }}>Felhasználói profil</Title>

      <Tabs value={currentTab} onChange={(value) => navigate(value === "profile" ? "/profile" : `/profile/${value}`)}>
        <Tabs.List>
          <Tabs.Tab value="profile">Profile</Tabs.Tab>
          <Tabs.Tab value="orders">Rendelések</Tabs.Tab>
          <Tabs.Tab value="favorites">Kedvencek</Tabs.Tab>
          <Tabs.Tab value="reviews">Értékelések</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      </Container>
  );
}