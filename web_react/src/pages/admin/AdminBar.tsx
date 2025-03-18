import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Container, Title, Tabs } from "@mantine/core";

export default function AdminBar() {
    const location = useLocation();
    const navigate = useNavigate();

    const currentTab = location.pathname === "/admin" ? "admin" : location.pathname.split("/admin/")[1];

return (
    <Container size="xl" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
      <Title order={2} style={{ marginBottom: "20px" }}>Admin Dashboard</Title>

      <Tabs value={currentTab} onChange={(value) => navigate(value === "admin" ? "/admin" : `/admin/${value}`)}>
        <Tabs.List>
          <Tabs.Tab value="admin">Portalok</Tabs.Tab>
          <Tabs.Tab value="products">Termék feltöltés</Tabs.Tab>
          <Tabs.Tab value="order">Rendelések kezelése</Tabs.Tab>
          <Tabs.Tab value="users">User kezelés</Tabs.Tab>
          <Tabs.Tab value="coupons">Kupon létrehozása</Tabs.Tab>
          <Tabs.Tab value="discounts">Kedvezmények létrehozása</Tabs.Tab>
          <Tabs.Tab value="shippings">Szállítási díjak</Tabs.Tab>
          <Tabs.Tab value="import">XLS import</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      </Container>
  );
}