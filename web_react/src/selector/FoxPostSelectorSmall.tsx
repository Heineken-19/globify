import React, { useState, useEffect } from "react";
import { Paper} from "@mantine/core";
import { FoxPostPoint } from "../hooks/useFavoritePickup";

interface Props {
  setSelectedPoint: (point: FoxPostPoint) => void;
  onClose: () => void;
}

const FoxPostSelectorSmall: React.FC<Props> = ({ setSelectedPoint, onClose }) => {
  const [iframeKey, setIframeKey] = useState<number>(0);

  useEffect(() => {
    // ✅ Iframe eseménykezelő
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("foxpost.hu")) return;

      try {
        const data = JSON.parse(event.data) as FoxPostPoint;
        if (data?.place_id && data?.name) {
          setSelectedPoint(data);
          localStorage.setItem("selectedShippingPoint", JSON.stringify(data));
          onClose(); // ✅ Iframe bezárása kiválasztás után
        }
      } catch (error) {
        console.error("❌ JSON feldolgozási hiba:", error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [setSelectedPoint, onClose]);



  return (
    <Paper shadow="xs" p="md">
      <iframe
        key={iframeKey}
        frameBorder="0"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups"
        referrerPolicy="no-referrer-when-downgrade"
        src="https://cdn.foxpost.hu/apt-finder/v1/app/?desktop_height=400"
        width="580"
        height="400"
        style={{ borderRadius: "8px" }}
      ></iframe>

    </Paper>
  );
};

export default FoxPostSelectorSmall;
