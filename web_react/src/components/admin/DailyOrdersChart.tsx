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
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useAdminOrders } from "../../hooks/admin/useAdminOrders";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useMediaQuery } from "@mantine/hooks";

// Bővítmények
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  width?: number;
  height?: number;
}

export default function OrdersChart({ width = 300, height = 300 }: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const chartSize = isMobile ? 220 : height;
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { orders, loading, error } = useAdminOrders();
  const [chartData, setChartData] = useState<{ date: string; totalOrders: number }[]>([]);

  useEffect(() => {
    if (orders.length > 0) {
      setChartData(
        orders.map((order) => ({
          date: order.date,
          totalOrders: order.totalOrders,
        }))
      );
    }
  }, [orders]);

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
          Napi rendelések száma
        </Title>
        <Text size="sm" color="dimmed">
          Beérkezett rendelések az elmúlt napokban
        </Text>
      </Stack>

      <ResponsiveContainer width="100%" height={chartSize}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 10, left: -10, bottom: 20 }} // Balra igazítás
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(tick) => dayjs(tick).format("MM.DD")}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            minTickGap={0}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => [`${value} rendelés`, "Rendelés"]}
            labelFormatter={(label) => `Dátum: ${dayjs(label).format("YYYY-MM-DD")}`}
          />
          <Line
            type="monotone"
            dataKey="totalOrders"
            stroke="#4caf50"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
