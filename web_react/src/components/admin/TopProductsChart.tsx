import { Card, Title } from "@mantine/core";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useTopProducts } from "../../hooks/admin/useTopProducts";

interface Props {
  width?: number;
  height?: number;
}

export default function TopProductsChart({ width = 300, height = 300 }: Props) {
  const { topProducts, loading, error } = useTopProducts();

  if (loading) return <p>Betöltés...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4} style={{ marginBottom: "xl" }}>Top 5 termék</Title>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topProducts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="sales" fill="#ff4081" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
