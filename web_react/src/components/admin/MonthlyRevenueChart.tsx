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

export default function MonthlyRevenueChart({ width = 300, height = 300 }: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const chartSize = isMobile ? 220 : height;
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const { monthlyRevenues, loading, error } = useRevenue();

  if (loading) return <Text>Betöltés...</Text>;
  if (error) return <Text color="red">{error}</Text>;

  const chartData = monthlyRevenues.map((rev) => ({
    month: dayjs(rev.startDate).format("YYYY. MMM"), // pl. 2025. ápr.
    totalRevenue: rev.totalRevenue,
    range: `${rev.startDate} - ${rev.endDate}`, // tooltiphez
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
          Havi bevétel (utolsó 5 hónap)
        </Title>
        <Text size="sm" color="dimmed">
        Az elmúlt 5 hónap összesített adatai
        </Text>
      </Stack>

      <ResponsiveContainer width="100%" height={chartSize}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 10, left: 0, bottom: 20 }} // Balra igazítás
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="period"
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
            formatter={(value: number, name, props) => [`${value.toLocaleString()} Ft`, "Bevétel"]}
            labelFormatter={(label: string, payload: any) =>
              `Hónap: ${label}\nIdőszak: ${payload[0]?.payload?.range}`
            }
          />
          <Bar
            dataKey="totalRevenue"
            fill="#ff5722"
            barSize={50}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
