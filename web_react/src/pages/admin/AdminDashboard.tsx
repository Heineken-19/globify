import {
  Container,
  Grid,
  Card,
  Text,
  useMantineTheme,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import OrdersChart from "../../components/admin/DailyOrdersChart";
import ActivityChart from "../../components/admin/UserActivityChart";
import UsersChart from "../../components/admin/RegisteredUsersChart";
import NewsletterChart from "../../components/admin/NewsletterChart";
import WeeklyRevenueChart from "../../components/admin/WeeklyRevenueChart";
import MonthlyRevenueChart from "../../components/admin/MonthlyRevenueChart";
import AdminBar from "./AdminBar";

export default function AdminDashboard() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmallScreen = useMediaQuery("(max-width: 480px)");

  const cardStyle = {
    padding: isSmallScreen ? 12 : isMobile ? 18 : 24,
    minHeight: isSmallScreen ? 200 : isMobile ? 250 : 300,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadows.md,
    backgroundColor: theme.white,
  };

  const chartSize = isSmallScreen ? 200 : isMobile ? 250 : 300;

  return (
    <Container size="xl" py="lg">
      <AdminBar />
      <Title order={2} my="md" ta="center" c={theme.colors.gray[7]}>
        📊 Portálok
      </Title>
      <Grid gutter="xl">
        {[ // chart komponensek és címek egy tömbben a DRY kedvéért
          { component: <ActivityChart width={chartSize} height={chartSize} /> },
          { component: <NewsletterChart width={chartSize} height={chartSize} /> },
          { component: <OrdersChart width={chartSize} height={chartSize} /> },
          { component: <UsersChart width={chartSize} height={chartSize} />},
          { component: <WeeklyRevenueChart width={chartSize} height={chartSize} /> },
          { component: <MonthlyRevenueChart width={chartSize} height={chartSize} /> },
        ].map((chart, index) => (
          <Grid.Col span={isMobile ? 12 : 6} key={index}>
            <Card style={cardStyle}>
              {chart.component}
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
