import { useEffect, useState } from "react";
import { Card, Title } from "@mantine/core";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useAdminOrders } from "../../hooks/admin/useAdminOrders";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Day.js bővítmények a dátumformázáshoz
dayjs.extend(utc);
dayjs.extend(timezone);

export default function OrdersChart() {
  const { orders, loading, error } = useAdminOrders();
  const [chartData, setChartData] = useState<{ date: string; totalOrders: number }[]>([]);

  useEffect(() => {
    if (orders.length > 0) {
      setChartData(
        orders.map((order) => ({
          date: order.date,
          totalOrders: order.totalOrders, // 🔹 API visszatérési érték
        }))
      );
    }
  }, [orders]);

  if (loading) return <p>Betöltés...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4} style={{ marginBottom: "xl" }}>Napi rendelések száma</Title>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(tick) => dayjs(tick).format("YYYY-MM-DD")} />
          <YAxis allowDecimals={false} />
          <Tooltip labelFormatter={(label) => `Dátum: ${dayjs(label).format("YYYY-MM-DD")}`} />
          <Line type="monotone" dataKey="totalOrders" stroke="#4caf50" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
