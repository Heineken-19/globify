import { Card, Title } from "@mantine/core";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useRevenue } from "../../hooks/admin/useRevenue";

export default function MonthlyRevenueChart() {
  const { monthlyRevenue, loading, error } = useRevenue();

  if (loading) return <p>Betöltés...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const chartData = [
    {
      period: `${monthlyRevenue?.startDate} - ${monthlyRevenue?.endDate}`,
      totalRevenue: monthlyRevenue?.totalRevenue || 0,
    },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4} style={{ marginBottom: "xl" }}>
        Havi bevétel ({monthlyRevenue?.startDate} - {monthlyRevenue?.endDate})
      </Title>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="totalRevenue" fill="#ff5722" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
