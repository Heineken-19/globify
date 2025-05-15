import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Group,
  MultiSelect,
  Popover,
  RangeSlider,
  Select,
  Text,
  Title,
} from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { useCategory } from "../hooks/useCategory";

type Props = {
  filters: any;
  setFilters: (fn: (prev: any) => any) => void;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
};

export const FilterControls: React.FC<Props> = ({
  filters,
  setFilters,
  showFilters,
  setShowFilters,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [pendingFilters, setPendingFilters] = useState<any>(filters);
  const [openPanel] = useState<"size" | "price" | null>(null);
  const { categories } = useCategory();

  useEffect(() => {
    if (pendingFilters.priceRange) {
      const [min, max] = pendingFilters.priceRange;
      setPendingFilters((prev: any) => ({
        ...prev,
        minPrice: min,
        maxPrice: max,
      }));
    }
  }, [pendingFilters.priceRange]);

  if (!showFilters) {
    return (
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start", // vagy "center" ha középre akarod vízszintesen is
          height: "100%", // fontos a vertical alignment miatt
          minHeight: 40, // hogy legyen mibe igazítani
          marginBottom: 0,
        }}
      >
        <Button
          variant="light"
          color="green"
          onClick={() => setShowFilters(true)}
          style={{
            alignSelf: "center", // biztos ami biztos
          }}
        >
          + Szűrés
        </Button>
      </Box>
    );
  }

  return (
    <Box
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        flexGrow: 1,
        minWidth: 0,
        marginBottom: 20,
      }}
    >
      <Box style={{ minWidth: 180, width: isMobile ? "100%" : undefined }}>
        <MultiSelect
          label="Kategóriák"
          placeholder="Válassz kategóriát"
          data={categories.map((cat) => ({ value: cat.name, label: cat.name }))}
          value={pendingFilters.categories || []}
          onChange={(value) =>
            setPendingFilters((prev: any) => ({
              ...prev,
              categories: value,
            }))
          }
          searchable
          clearable
          size="sm"
        />
      </Box>

      <Box style={{ minWidth: 180, width: isMobile ? "100%" : undefined }}>
        <Select
          label="Fényigény"
          placeholder="Válassz..."
          data={[
            { value: "Alacsony", label: "Alacsony" },
            { value: "Közepes", label: "Közepes" },
            { value: "Magas", label: "Magas" },
          ]}
          value={pendingFilters.light || ""}
          onChange={(value) =>
            setPendingFilters((prev: any) => ({
              ...prev,
              light: value,
            }))
          }
          clearable
          size="sm"
        />
      </Box>

      <Box style={{ minWidth: 180, width: isMobile ? "100%" : undefined }}>
        <Select
          label="Vízigény"
          placeholder="Válassz..."
          data={[
            { value: "Alacsony", label: "Alacsony" },
            { value: "Közepes", label: "Közepes" },
            { value: "Magas", label: "Magas" },
          ]}
          value={pendingFilters.water || ""}
          onChange={(value) =>
            setPendingFilters((prev: any) => ({
              ...prev,
              water: value,
            }))
          }
          clearable
          size="sm"
        />
      </Box>

      <Box style={{ minWidth: 180, width: isMobile ? "100%" : undefined }}>
        <Title order={6} mb={4}>
          Méret
        </Title>
        <Popover width={260} position="bottom-start" shadow="md">
          <Popover.Target>
            <Button variant="default" size="sm" fullWidth>
              {pendingFilters.sizeRange
                ? `${pendingFilters.sizeRange[0]} - ${pendingFilters.sizeRange[1]} cm`
                : "Válasszon..."}
              <Group justify="space-between" gap={4}>
                <Text fw={500} size="sm"></Text>
                {openPanel ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
              </Group>
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <RangeSlider
              min={0}
              max={500}
              step={1}
              p={1}
              mb={15}
              value={pendingFilters.sizeRange || [0, 500]}
              onChange={(value) =>
                setPendingFilters((prev: any) => ({
                  ...prev,
                  sizeRange: value,
                }))
              }
              marks={[
                { value: 0, label: "0" },
                { value: 500, label: "500" },
              ]}
            />
          </Popover.Dropdown>
        </Popover>
      </Box>

      <Box style={{ minWidth: 180, width: isMobile ? "100%" : undefined }}>
        <Title order={6} mb={4}>
          Ár
        </Title>
        <Popover width={260} position="bottom-start" shadow="md">
          <Popover.Target>
            <Button variant="default" size="sm" fullWidth>
              {pendingFilters.priceRange
                ? `${pendingFilters.priceRange[0]} Ft - ${pendingFilters.priceRange[1]} Ft`
                : "Válasszon..."}
              <Group justify="space-between" gap={4}>
                <Text fw={500} size="sm"></Text>
                {openPanel ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
              </Group>
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <RangeSlider
              min={0}
              max={200000}
              step={1000}
              p={1}
              mb={15}
              value={pendingFilters.priceRange || [0, 200000]}
              onChange={(value) =>
                setPendingFilters((prev: any) => ({
                  ...prev,
                  priceRange: value,
                }))
              }
              
              marks={[
                { value: 0, label: "0 Ft" },
                { value: 200000, label: "200K" },
              ]}
            />
          </Popover.Dropdown>
        </Popover>
      </Box>

      <Group mt={8}>
        <Button
          type="button"
          color="green"
          size="xs"
          onClick={() => setFilters(pendingFilters)}
        >
          Szűrés alkalmazása
        </Button>

        <Button
          type="button"
          variant="subtle"
          size="sm"
          color="red"
          onClick={() => {
            setPendingFilters({});
            setFilters(() => ({}));
          }}
        >
          Szűrés törlése
        </Button>

        <Button
          variant="subtle"
          size="xs"
          mt={8}
          onClick={() => setShowFilters(false)}
        >
          Szűrés elrejtése
        </Button>
      </Group>
    </Box>
  );
};
