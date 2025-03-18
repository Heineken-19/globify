import { Card, Title } from "@mantine/core";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useRevenue } from "../../hooks/admin/useRevenue";

export default function WeeklyRevenueChart() {
  const { weeklyRevenue, loading, error } = useRevenue();

  if (loading) return <p>Betöltés...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const chartData = [
    {
      period: `${weeklyRevenue?.startDate} - ${weeklyRevenue?.endDate}`,
      totalRevenue: weeklyRevenue?.totalRevenue || 0,
    },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4} style={{ marginBottom: "xl" }}>
        Heti bevétel ({weeklyRevenue?.startDate} - {weeklyRevenue?.endDate})
      </Title>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="totalRevenue" fill="#3f51b5" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
