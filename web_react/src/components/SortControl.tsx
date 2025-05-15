import React from "react";
import { Box, Select } from "@mantine/core";

interface SortControlProps {
  sortOrder: string;
  setSortOrder: (value: string) => void;
  isMobile: boolean;
}

export const SortControl: React.FC<SortControlProps> = ({
  sortOrder,
  setSortOrder,
  isMobile,
}) => {
  return (
<Box
  style={{
    display: "flex",
    justifyContent: isMobile ? "unset" : "flex-end",
    minWidth: 200,
    width: isMobile ? "100%" : undefined,
  }}
>
  <Select
    placeholder="Válassz..."
    data={[
      { value: "", label: "Alapértelmezett" },
      { value: "priceAsc", label: "Ár szerint (növekvő)" },
      { value: "priceDesc", label: "Ár szerint (csökkenő)" },
      { value: "nameAsc", label: "Név szerint (A-Z)" },
      { value: "nameDesc", label: "Név szerint (Z-A)" },
    ]}
    value={sortOrder}
    onChange={(value) => setSortOrder(value || "")}
    size="sm"
  />
</Box>
  );
};
