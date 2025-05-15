import { Box, Text, Accordion, Title } from "@mantine/core";

export default function RewardProgram() {
  return (
    <Box p={"md"}>
      <Title order={2}>Hűségprogram</Title>
      <Text size="sm" mb="sm">
        Vásárlásaid után pontokat kapsz (100 Ft = 1 pont), melyet vásárláskor fel tudsz használni (1 pont = 1 Ft).
      </Text>
      <Accordion variant="separated" radius="md">
        <Accordion.Item value="invite">
          <Accordion.Control>Hívd meg barátaidat</Accordion.Control>
          <Accordion.Panel>Oszd meg egyedi meghívó linkedet, és minden új regisztráló után 500 pontot kapsz.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="review">
          <Accordion.Control>Értékelj minket Google vagy Facebook-on</Accordion.Control>
          <Accordion.Panel>Adj egy 5 csillagos értékelést, és 300 pontot írunk jóvá.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="product-review">
          <Accordion.Control>Véleményezz terméket</Accordion.Control>
          <Accordion.Panel>Minden egyes termékértékelésért 100 pontot kapsz.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="bonus-order">
          <Accordion.Control>Vásárolj 20.000 Ft felett</Accordion.Control>
          <Accordion.Panel>Minden 20.000 Ft feletti vásárlás után extra 200 pont jár.</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
}