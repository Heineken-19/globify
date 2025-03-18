import React from "react";
import { Divider, Text } from "@mantine/core";

interface InfoBarProps {
  amountToFreeShipping: number;
}

const InfoBar: React.FC<InfoBarProps> = ({ amountToFreeShipping }) => {
  const isFreeShippingAvailable = amountToFreeShipping <= 0;

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: isFreeShippingAvailable ? "#d4edda" : "#ffffff",
        color: isFreeShippingAvailable ? "#155724" : "#333",
        padding: "6px",
        textAlign: "center",
        position: "sticky",
        top: 0,
        zIndex: 900,
        transition: "background-color 0.3s ease, color 0.3s ease, border-bottom 0.3s ease",
        borderRadius: "4px",
        overflow: "hidden", 
        textOverflow: "ellipsis", 
        whiteSpace: "nowrap",
      }}
    >
      
      <Text size="sm" fw={500} style={{ lineHeight: "1.5" }}>
        {isFreeShippingAvailable
          ? "Az ingyenes szállítás elérhető!" 
          : `Már csak ${amountToFreeShipping.toLocaleString()} Ft szükséges az ingyenes szállításhoz!`}
      </Text>
    </div>
  );
};

export default React.memo(InfoBar);
