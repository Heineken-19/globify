import { useEffect, useState } from "react";
import { Card, Title } from "@mantine/core";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useLogins } from "../../hooks/admin/useLogins";
import dayjs from "dayjs";
import { useMediaQuery } from '@mantine/hooks';

interface Props {
  width?: number;
  height?: number;
}

export default function LoginsChart({ width = 300, height = 300 }: Props) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const chartSize = isMobile ? 200 : 300;
  const { logins, loading, error } = useLogins();
  const [chartData, setChartData] = useState<{ date: string; logins: number }[]>([]);


  useEffect(() => {
    if (logins.length > 0) {
      setChartData(
        logins.map((login) => ({
          date: dayjs(login.date).format("YYYY-MM-DD"), // 🔹 Napra pontos dátum
          logins: login.logins,
        }))
      );
    }
  }, [logins]);

  if (loading) return <p>Betöltés...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%", // Biztosítjuk, hogy a Card kitöltse a szülőelemet
    }}>
      <Title order={4} style={{ marginBottom: "xl" }}>Napi bejelentkezések száma</Title>
      <ResponsiveContainer width="100%" height={chartSize}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date"  />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="logins" stroke="#f44336" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
