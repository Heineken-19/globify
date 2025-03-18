import React, { useState, useEffect } from "react";
import { Paper, Text, Button, Container } from "@mantine/core";
import { FoxPostPoint, useFavoritePickup } from "../hooks/useFavoritePickup";
import {useNotification} from "../context/NotificationContext";

interface Props {
  setSelectedPoint: (point: FoxPostPoint) => void;
}

const FoxPostSelector: React.FC<Props> = ({ setSelectedPoint }) => {
  // ✅ Helyes típusdefiníció
  const [pointData, setPointData] = useState<FoxPostPoint | null>(null);
  const { favoritePoint, saveFavorite } = useFavoritePickup();
  const { showSuccess } = useNotification();

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
    <Container size="lg" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* ✅ Ha van kedvenc pont */}
      {pointData ? (
        <Paper shadow="xs" p="md" mb="md">
          <Text fw={600}>Kiválasztott automata:</Text>
          <Text>{pointData.name}</Text>
          <Text>{pointData.city}, {pointData.zip}</Text>
          <Text>{pointData.address}</Text>
          <Button mt="md" variant="outline" onClick={() => setPointData(null)}>
            Másik csomagpont választása
          </Button>
          <Button mt="md" onClick={handleSaveFavorite} color="blue">
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
        width="1200"
        height="800"
      ></iframe>
      )}
    </Container>
  );
};

export default FoxPostSelector;
