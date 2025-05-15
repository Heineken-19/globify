import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Container, Title, Tabs } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function AdminBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const currentTab = location.pathname === "/admin" ? "admin" : location.pathname.split("/admin/")[1]?.split("/")[0];

    const tabStyle = {
      fontSize: isMobile ? "14px" : "16px",
      padding: isMobile ? "5px 10px" : "10px 16px",
    };

return (
    <Container size="xl" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
      <Title order={2} style={{ marginBottom: "20px" }}>Admin Dashboard</Title>

      <Tabs value={currentTab} onChange={(value) => navigate(value === "admin" ? "/admin" : `/admin/${value}`)}>
      <Tabs.List
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "6px" : "10px",
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
           <Tabs.Tab value="admin" style={tabStyle}> Portalok</Tabs.Tab>
          <Tabs.Tab value="products" style={tabStyle}>Termék feltöltés</Tabs.Tab>
          <Tabs.Tab value="order" style={tabStyle}>Rendelések kezelése</Tabs.Tab>
          <Tabs.Tab value="users" style={tabStyle}>Users kezelés</Tabs.Tab>
          <Tabs.Tab value="coupons" style={tabStyle}>Kuponok</Tabs.Tab>
          <Tabs.Tab value="discounts" style={tabStyle}>Kedvezmények </Tabs.Tab>
          <Tabs.Tab value="shippings" style={tabStyle}>Szállítási díjak</Tabs.Tab>
          <Tabs.Tab value="import" style={tabStyle}>XLS import</Tabs.Tab>
          <Tabs.Tab value="news" style={tabStyle}>Hírlevél</Tabs.Tab>
          <Tabs.Tab value="blog" style={tabStyle}>Blog</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      </Container>
  );
}