import { useEffect, useState } from "react";
import {
  Card,
  Title,
  Text,
  Stack,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useAdmin } from "../../hooks/admin/useAdmin";
import { RegistrationData } from "../../types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useMediaQuery } from "@mantine/hooks";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  width?: number;
  height?: number;
}

export default function UsersChart({ width = 300, height = 300 }: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const chartSize = isMobile ? 220 : height;
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

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
            users: item.registrations,
          }))
        );
      }
    };

    fetchRegistrations();
  }, []);

  if (loading) return <Text>Betöltés...</Text>;
  if (error) return <Text color="red">{error}</Text>;

  return (
    <Card
      withBorder
      radius="lg"
      padding="lg"
      shadow="sm"
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      }}
    >
      <Stack gap="xs" style={{ paddingBottom: 10, marginBottom: "xl" }}>
        <Title order={4} style={{ color: theme.colors.gray[8] }}>
          Regisztrált felhasználók növekedése
        </Title>
        <Text size="sm" color="dimmed">
          Napi regisztrációk az elmúlt egy hétben
        </Text>
      </Stack>

      <ResponsiveContainer width="100%" height={chartSize}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 10, left: -10, bottom: 20 }} // 🔧 Bal oldal igazítás
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(tick) => dayjs(tick).format("MM.DD")}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => [`${value} regisztráció`, "Felhasználók"]}
            labelFormatter={(label) => `Dátum: ${dayjs(label).format("YYYY-MM-DD")}`}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#2196f3"
            fill="#90caf9"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
