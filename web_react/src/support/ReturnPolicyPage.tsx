import { Container, Text } from "@mantine/core";

export default function ReturnPolicyPage() {
  return (
    <Container size="md" mt="xl">
      <Text size="xl" fw={700} mb="md">
        Visszaküldési feltételek
      </Text>
      <Text>
        Vásárlóink elégedettsége kiemelten fontos számunkra. Amennyiben nem vagy elégedett a termékkel,
        14 napon belül visszaküldheted az alábbi feltételekkel:
      </Text>
      <ul style={{ marginTop: 16 }}>
        <li>A terméket eredeti csomagolásban kell visszaküldeni.</li>
        <li>A termék nem lehet sérült vagy használt.</li>
        <li>A visszaküldés költsége a vásárlót terheli, kivéve, ha hibás terméket kaptál.</li>
        <li>Az összeget 5 munkanapon belül visszatérítjük a visszaküldés után.</li>
        <li>Higiéniai termékeket (pl. kozmetikumok) nem áll módunkban visszavenni.</li>
      </ul>
      <Text mt="md">
        Ha kérdésed van, lépj kapcsolatba velünk az{" "}
        <a href="/support/contact" style={{ color: "#22b8cf", textDecoration: "none", fontWeight: 500 }}>
          ügyfélszolgálati oldalunkon
        </a>
        .
      </Text>
    </Container>
  );
}
