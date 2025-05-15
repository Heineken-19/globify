import { Accordion, Container, Text } from "@mantine/core";

export default function FaqPage() {
  return (
    <Container size="md" mt="xl">
      <Text size="xl" fw={700} mb="md">
        GYIK - Gyakran Ismételt Kérdések
      </Text>
      <Accordion>
        <Accordion.Item value="shipping">
          <Accordion.Control>Mennyi idő alatt kapom meg a rendelésem?</Accordion.Control>
          <Accordion.Panel>
            A rendeléseket általában 2-5 munkanapon belül kézbesítjük.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="return">
          <Accordion.Control>Hogyan küldhetek vissza egy terméket?</Accordion.Control>
          <Accordion.Panel>
            A visszaküldési folyamat részleteit a "Visszaküldési feltételek" oldalon találod.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="payment">
          <Accordion.Control>Milyen fizetési módokat fogadnak el?</Accordion.Control>
          <Accordion.Panel>
            Elfogadjuk a bankkártyás fizetést, PayPal-t, utánvétet és banki átutalást.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="cancel">
          <Accordion.Control>Le tudom mondani a rendelésem?</Accordion.Control>
          <Accordion.Panel>
            A rendelést csak a feladás előtt lehet lemondani. Kérjük, vedd fel velünk a kapcsolatot!
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
