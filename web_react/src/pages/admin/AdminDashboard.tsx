import { Container, Grid, Card } from "@mantine/core";
import OrdersChart from "../../components/admin/DailyOrdersChart";
import ActivityChart from "../../components/admin/UserActivityChart";
import UsersChart from "../../components/admin/RegisteredUsersChart";
import LoginsChart from "../../components/admin/DailyLoginsChart";
import WeeklyRevenueChart from "../../components/admin/WeeklyRevenueChart";
import MonthlyRevenueChart from "../../components/admin/MonthlyRevenueChart";

import AdminBar from "./AdminBar";

export default function AdminDashboard() {

  
  return (
    <Container size="xl" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
      <AdminBar />
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <ActivityChart />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <LoginsChart />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <OrdersChart />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <UsersChart />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <WeeklyRevenueChart />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <MonthlyRevenueChart />
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
