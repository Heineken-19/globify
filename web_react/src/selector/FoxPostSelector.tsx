import React, { useState, useEffect } from "react";
import { Paper, Text, Button, Container, rem } from "@mantine/core";
import { FoxPostPoint, useFavoritePickup } from "../hooks/useFavoritePickup";
import {useNotification} from "../context/NotificationContext";
import { useMediaQuery } from '@mantine/hooks';

interface Props {
  setSelectedPoint: (point: FoxPostPoint) => void;
}

const FoxPostSelector: React.FC<Props> = ({ setSelectedPoint }) => {
  // ✅ Helyes típusdefiníció
  const [pointData, setPointData] = useState<FoxPostPoint | null>(null);
  const { favoritePoint, saveFavorite } = useFavoritePickup();
  const { showSuccess } = useNotification();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // ✅ Előzőleg kiválasztott pont betöltése (localStorage-ből)
    if (!pointData) {
      const storedPoint = localStorage.getItem("selectedShippingPoint");
      if (storedPoint) {
        try {
          // ✅ JSON.parse → `unknown` típusra állítás
          const parsedPoint: unknown = JSON.parse(storedPoint);

          // ✅ Típusellenőrzés (typeof + validáció)
          if (
            typeof parsedPoint === "object" &&
            parsedPoint !== null &&
            "place_id" in parsedPoint &&
            "name" in parsedPoint &&
            "city" in parsedPoint &&
            "zip" in parsedPoint &&
            "address" in parsedPoint
          ) {
            // ✅ Type Assertion FoxPostPoint típusra
            const validPoint = parsedPoint as FoxPostPoint;

            // ✅ Csak akkor frissítjük az állapotot, ha eltér az érték
            if (!pointData || validPoint.place_id !== (pointData as FoxPostPoint).place_id) {
              setPointData(validPoint);
            }
          }
        } catch (error) {
          console.error("⚠️ JSON feldolgozási hiba:", error);
        }
      }
    }

    // ✅ Kedvenc pont betöltése backendből, ha nincs még adat
    if (favoritePoint && (!pointData || favoritePoint.place_id !== pointData.place_id)) {
      setPointData(favoritePoint);
      setSelectedPoint(favoritePoint);
    }

    // ✅ Iframe eseménykezelő regisztráció
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("foxpost.hu")) return;

      try {
        // ✅ JSON.parse → `unknown` típusra állítás
        const data: unknown = JSON.parse(event.data);

        // ✅ Típusellenőrzés
        if (
          typeof data === "object" &&
          data !== null &&
          "place_id" in data &&
          "name" in data &&
          "city" in data &&
          "zip" in data &&
          "address" in data
        ) {
          const validData = data as FoxPostPoint;
          if (!pointData || validData.place_id !== pointData.place_id) {
            setPointData(validData);
            setSelectedPoint(validData);
            localStorage.setItem("selectedShippingPoint", JSON.stringify(validData));
          }
        }
      } catch (error) {
        console.error("❌ JSON feldolgozási hiba:", error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [favoritePoint, setSelectedPoint]); // ✅ Dependency lista helyesen megadva

  // ✅ Csak akkor mentjük el, ha valódi változás történt
  const handleSaveFavorite = async () => {
    if (pointData && pointData.place_id !== favoritePoint?.place_id) {
      await saveFavorite(pointData);
      showSuccess("Kedvenc átvételi pont mentve!");
    }
  };

  return (
    <Container size="lg" 
    style={{ 
      maxWidth: isMobile ? "100%" : "1200px", 
      margin: "0 auto",
      padding: isMobile ? rem(10) : rem(20),
      }}>
      {/* ✅ Ha van kedvenc pont */}
      {pointData ? (
        <Paper 
          shadow="xs"
          p={isMobile ? rem(12) : rem(16)}
          mb="md"
          style={{
            borderRadius: rem(10),
          }}
          >
          <Text fw={600} size={isMobile ? "sm" : "md"}>Kiválasztott automata:</Text>
          <Text size={isMobile ? "xs" : "sm"}>{pointData.name}</Text>
          <Text size={isMobile ? "xs" : "sm"}>{pointData.city}, {pointData.zip}</Text>
          <Text size={isMobile ? "xs" : "sm"}>{pointData.address}</Text>
          <Button mt="md" variant="outline" onClick={() => setPointData(null)} fullWidth={isMobile}  style={{
              fontSize: isMobile ? rem(12) : rem(14),
              marginRight: isMobile ? rem(0) : rem(8),
            }}>
            Másik csomagpont választása
          </Button>
          <Button mt="md" onClick={handleSaveFavorite} color="blue"  style={{
              fontSize: isMobile ? rem(12) : rem(14),
            }}>
            Kedvencként mentés
          </Button>
        </Paper>
      ) : (
        // ✅ Ha nincs kiválasztott pont → FoxPost iframe megjelenítése
        <iframe
        frameBorder="0"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups"
        src="https://cdn.foxpost.hu/apt-finder/v1/app/?desktop_height=450"
        width={isMobile ? "100%" : "1200"}
        height={isMobile ? "400" : "800"}
        style={{
          borderRadius: rem(8),
          marginTop: isMobile ? rem(10) : rem(20),
        }}
      ></iframe>
      )}
    </Container>
  );
};

export default FoxPostSelector;
