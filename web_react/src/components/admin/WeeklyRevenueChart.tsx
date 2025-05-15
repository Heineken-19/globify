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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useRevenue } from "../../hooks/admin/useRevenue";
import { useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";

interface Props {
  width?: number;
  height?: number;
}

export default function WeeklyRevenueChart({ width = 300, height = 300 }: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const chartSize = isMobile ? 220 : height;
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const { weeklyRevenues, loading, error } = useRevenue();

  if (loading) return <Text>Betöltés...</Text>;
  if (error) return <Text color="red">{error}</Text>;

  const chartData = weeklyRevenues.map((week) => ({
    weekLabel: `${dayjs(week.startDate).format("MM.DD")} - ${dayjs(week.endDate).format("MM.DD")}`,
    totalRevenue: week.totalRevenue,
    fullRange: `${week.startDate} - ${week.endDate}`,
  }));

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
          Heti bevétel (utolsó 5 hét)
        </Title>
        <Text size="sm" color="dimmed">
          Minden hét hétfőtől vasárnapig
        </Text>
      </Stack>

      <ResponsiveContainer width="100%" height={chartSize}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 10, left: -10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="weekLabel"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toLocaleString()} Ft`, "Bevétel"]}
            labelFormatter={(label, payload) =>
              `Időszak: ${payload?.[0]?.payload?.fullRange}`
            }
          />
          <Bar
            dataKey="totalRevenue"
            fill="#3f51b5"
            barSize={40}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
