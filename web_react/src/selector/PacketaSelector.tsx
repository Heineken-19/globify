import React, { useState, useEffect } from "react";
import { Paper, Text, Button, Container } from "@mantine/core";

interface PacketaPoint {
  id: string;
  name: string;
  city: string;
  zip: string;
  address: string;
}

interface PacketaSelectorProps {
  setSelectedPoint: (point: PacketaPoint) => void;
}

const PacketaSelector: React.FC<PacketaSelectorProps> = ({ setSelectedPoint }) => {
  const [pointData, setPointData] = useState<PacketaPoint | null>(null);

  useEffect(() => {
    // 🔹 Betöltjük az előzőleg kiválasztott automatát
    const storedPoint = localStorage.getItem("selectedShippingPoint");
    if (storedPoint) {
      try {
        const parsedPoint: PacketaPoint = JSON.parse(storedPoint);
        setPointData(parsedPoint);
        setSelectedPoint(parsedPoint);
      } catch (error) {
        console.error("⚠️ Hiba az előző Packeta automata betöltésekor:", error);
      }
    }

    // 🔹 Figyelünk az üzenetekre az iframe-ből
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("widget.packeta.com")) {
        console.warn("⚠️ Nem Packeta üzenet érkezett, figyelmen kívül hagyjuk.");
        return;
      }

      try {
        console.log("📩 Packeta üzenet érkezett:", event.data);
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data && data.packetaBranchId && data.packetaBranchName) {
          const selectedPoint: PacketaPoint = {
            id: String(data.packetaBranchId),
            name: data.packetaBranchName,
            city: data.city || "",
            zip: data.zip || "",
            address: data.address || ""
          };
          
          console.log("✅ Mentésre kerülő Packeta automata:", selectedPoint);
          setPointData(selectedPoint);
          setSelectedPoint(selectedPoint);
          localStorage.setItem("selectedShippingPoint", JSON.stringify(selectedPoint));
        }
      } catch (error) {
        console.error("❌ JSON feldolgozási hiba:", error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setSelectedPoint]);

  return (
    <Container size="lg" style={{ maxWidth: "1200px", margin: "0 auto" }}>

      {pointData && (
        <Paper shadow="xs" p="md" mb="md" >
          <Text fw={500}>Kiválasztott automata:</Text>
          <Text>{pointData.name}</Text>
          <Text>{pointData.city}, {pointData.zip}</Text>
          <Text>{pointData.address}</Text>
          <Button mt="md" variant="outline" onClick={() => {
            setPointData(null);
            localStorage.removeItem("selectedShippingPoint");
          }}>
            Másik csomagpont választása
          </Button>
        </Paper>
      )}

      {!pointData && (
        <iframe
          frameBorder="0"
          loading="lazy"
          src="https://widget.packeta.com/v6/"
          width="1200"
          height="800"
        ></iframe>
      )}
    </Container>
  );
};

export default PacketaSelector;