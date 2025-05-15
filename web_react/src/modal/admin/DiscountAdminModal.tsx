import { Modal, NumberInput, Button } from "@mantine/core";
import { useState, useEffect } from "react";
import { useAdminDiscounts } from "../../hooks/admin/useAdminDiscounts";
import { useModal } from "../../context/ModalContext";

interface Props {
  opened: boolean;
  onClose: () => void;
  productId: number;
  currentValue: number | null;
  onSave: (discount: number) => void;
}

export default function DiscountAdminModal({ opened, onClose, productId, currentValue, onSave }: Props) {
  const [value, setValue] = useState<number | undefined>(undefined);
  const { updateDiscountMutation } = useAdminDiscounts();
  const { setModalOpen } = useModal();

  useEffect(() => {
    setModalOpen(opened); // amikor nyitva van, állítsd be
  }, [opened]);

  useEffect(() => {
    setValue(currentValue ?? undefined); // ha null, akkor undefined
  }, [currentValue]);

  const handleSave = async (newValue: number) => {
    try {
      await updateDiscountMutation.mutateAsync({ productId, discount: newValue });
      onSave(newValue); // csak siker után hívjuk
      onClose();
    } catch (e) {
      console.error("Nem sikerült menteni a kedvezményt", e);
    }
  };
  
  return (
    <Modal opened={opened} onClose={onClose} title="Kedvezmény beállítása" centered>
      <NumberInput
        label="Kedvezmény (%)"
        value={value}
        onChange={(val) => setValue(typeof val === "number" ? val : undefined)}
        min={0}
        max={100}
        step={5}
        suffix="%"
      />
      <Button
        fullWidth
        mt="md"
        color="green"
        disabled={value === undefined}
        onClick={() => value !== undefined && handleSave(value)}
      >
        Mentés
      </Button>
    </Modal>
  );
}
