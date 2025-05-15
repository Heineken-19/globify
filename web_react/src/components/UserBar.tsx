import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Container, Title, Tabs, rem } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function AdminBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const currentTab = location.pathname === "/profile" ? "profile" : location.pathname.split("/profile/")[1];

return (
    <Container 
    size="xl" 
    style={{ 
      paddingTop: isMobile ? rem(10) : rem(20), 
      paddingBottom: isMobile ? rem(10) : rem(20), 
      }}>
      <Title 
      order={2} 
      style={{ 
        marginBottom: isMobile ? rem(10) : rem(20),
        ontSize: isMobile ? rem(18) : rem(24),
         }}>
          Profilom
          </Title>

      <Tabs 
      value={currentTab} 
      onChange={(value) => 
        navigate(value === "profile" ? "/profile" : `/profile/${value}`)
        }
        >
       <Tabs.List
          style={{
            flexDirection: isMobile ? "column" : "row", 
            gap: isMobile ? rem(6) : rem(16), 
          }}
        >
          <Tabs.Tab 
            value="profile"
            style={{
              fontSize: isMobile ? rem(12) : rem(16),
              padding: isMobile ? rem(4) : rem(8), 
            }}
            >
              Profile
              </Tabs.Tab>
          <Tabs.Tab
           value="orders"
           style={{
            fontSize: isMobile ? rem(12) : rem(16),
            padding: isMobile ? rem(4) : rem(8),
          }}
           >
            Rendelések
            </Tabs.Tab>
          <Tabs.Tab 
          value="favorites"
          style={{
            fontSize: isMobile ? rem(12) : rem(16),
            padding: isMobile ? rem(4) : rem(8),
          }}
          >
            Kedvencek
            </Tabs.Tab>
          <Tabs.Tab 
          value="reviews"
          style={{
            fontSize: isMobile ? rem(12) : rem(16),
            padding: isMobile ? rem(4) : rem(8),
          }}
          >
            Értékelések
            </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      </Container>
  );
}