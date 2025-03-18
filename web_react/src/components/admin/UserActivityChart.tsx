import { Card, Title } from "@mantine/core";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useAdmin } from "../../hooks/admin/useAdmin";
import dayjs from "dayjs";

export default function ActivityChart() {
  const { activity, loading, error } = useAdmin();

  if (loading) return <p>Betöltés...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4} style={{ marginBottom: "xl" }}>Felhasználói aktivitás (Napi bejelentkezések)</Title>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={activity}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(tick) => dayjs(tick).format("YYYY-MM-DD")} />
          <YAxis allowDecimals={false} />
          <Tooltip labelFormatter={(label) => `Dátum: ${dayjs(label).format("YYYY-MM-DD")}`} />
          <Bar dataKey="count" fill="#ff9800" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
