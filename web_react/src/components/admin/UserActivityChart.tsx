import {
  Card,
  Title,
  Text,
  useMantineTheme,
  Stack,
  useMantineColorScheme
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
import { useAdmin } from "../../hooks/admin/useAdmin";
import dayjs from "dayjs";
import { useMediaQuery } from "@mantine/hooks";

interface Props {
  width?: number;
  height?: number;
}

export default function ActivityChart({ width = 300, height = 300 }: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const chartSize = isMobile ? 220 : height;
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const { activity, loading, error } = useAdmin();

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
        backgroundColor: colorScheme === "dark" ? theme.colors.dark[6] : theme.white
      }}
    >
      <Stack gap="xs" style={{ paddingBottom: 10, marginBottom: "xl" }}>
        <Title order={4} style={{ color: theme.colors.gray[8] }}>
          Napi felhasználói aktivitás
        </Title>
        <Text size="sm" color="dimmed">
          Bejelentkezések száma az elmúlt napokban
        </Text>
      </Stack>

      <ResponsiveContainer width="100%" height={chartSize}>
  <BarChart
    data={activity}
    margin={{ top: 10, right: 10, left: -10, bottom: 20 }} // 🔧 Balra toljuk a teljes chartot
    barCategoryGap={8} // 🔧 Sűrűbb oszlopok
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis
      dataKey="date"
      tickFormatter={(tick) => dayjs(tick).format("MM.DD")}
      tick={{ fontSize: 12 }}
      axisLine={false}
      tickLine={false}
      minTickGap={0} // 🔧 Kevesebb helyet kér a dátumoknak
    />
    <YAxis
      allowDecimals={false}
      axisLine={false}
      tickLine={false}
      tick={{ fontSize: 12 }}
    />
    <Tooltip
      formatter={(value: number) => [`${value} bejelentkezés`, "Bejelentkezés"]}
      labelFormatter={(label) => `Dátum: ${dayjs(label).format("YYYY-MM-DD")}`}
    />
    <Bar dataKey="count" fill="#ff9800" radius={[4, 4, 0, 0]} barSize={28} />
  </BarChart>
</ResponsiveContainer>
    </Card>
  );
}
