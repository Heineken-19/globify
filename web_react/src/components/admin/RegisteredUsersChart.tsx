import { useEffect, useState } from "react";
import { Card, Title } from "@mantine/core";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useAdmin } from "../../hooks/admin/useAdmin";
import { RegistrationData } from "../../types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Day.js bővítmények a dátumformázáshoz
dayjs.extend(utc);
dayjs.extend(timezone);

export default function UsersChart() {
  const { getRegistrations, loading, error } = useAdmin();
  const [chartData, setChartData] = useState<{ date: string; users: number }[]>([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      const today = new Date().toISOString().split("T")[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      const formattedStartDate = startDate.toISOString().split("T")[0];

      const data: RegistrationData[] = await getRegistrations(formattedStartDate, today);
      if (Array.isArray(data)) {
        setChartData(
          data.map((item) => ({
            date: item.date,
            users: item.registrations, // 🔹 Biztosítjuk a helyes kulcsokat
          }))
        );
      }
    };

    fetchRegistrations();
  }, []); // 🔹 Üres tömb biztosítja, hogy csak egyszer fusson le

  if (loading) return <p>Betöltés...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4} style={{ marginBottom: "xl" }}>Regisztrált felhasználók növekedése</Title>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(tick) => dayjs(tick).format("YYYY-MM-DD")} />
          <YAxis allowDecimals={false} />
          <Tooltip labelFormatter={(label) => `Dátum: ${dayjs(label).format("YYYY-MM-DD")}`} />
          <Area type="monotone" dataKey="users" stroke="#2196f3" fill="#90caf9" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
