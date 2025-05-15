import { useEffect, useState } from "react";
import {
  Card,
  Title,
  Text,
  useMantineTheme,
  Stack,
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
import { useNewsletterStats } from "../../hooks/admin/useNewsletterStats";
import dayjs from "dayjs";

export default function NewsletterChart({ width = 300, height = 300 }) {
  const { data = [], isLoading, isError } = useNewsletterStats();
  const [chartData, setChartData] = useState<{ date: string; subscriptions: number }[]>([]);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    if (data.length > 0) {
      setChartData(
        data.map((item: { date: string; subscriptions: number }) => ({
          date: dayjs(item.date).format("YYYY-MM-DD"),
          subscriptions: item.subscriptions,
        }))
      );
    }
  }, [data]);

  if (isLoading) return <Text>Betöltés...</Text>;
  if (isError) return <Text color="red">Hiba történt az adatok lekérésekor.</Text>;

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
          Napi feliratkozók száma
        </Title>
        <Text size="sm" color="dimmed">
          Hírlevélre feliratkozások az elmúlt napokban
        </Text>
      </Stack>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 10, left: -10, bottom: 20 }} // 🔧 balra tolva
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
            formatter={(value: number) => [`${value} feliratkozás`, "Feliratkozás"]}
            labelFormatter={(label) => `Dátum: ${dayjs(label).format("YYYY-MM-DD")}`}
          />
          <Line
            type="monotone"
            dataKey="subscriptions"
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
