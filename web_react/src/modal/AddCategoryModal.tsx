import { useEffect, useState } from "react";
import { Modal, TextInput, Button, Group, List, Loader, ActionIcon, Text } from "@mantine/core";
import { IconX, IconCircleCheck } from "@tabler/icons-react";
import { useCategories, useCreateCategory } from "../hooks/admin/useAdminProduct";

interface AddCategoryModalProps {
  opened: boolean;
  onClose: () => void;
}

const AddCategoryModal = ({ opened, onClose }: AddCategoryModalProps) => {
  const { data: categories, isLoading, refetch } = useCategories();
  const { mutate: createCategory } = useCreateCategory();

  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (opened) {
      setNewCategory("");
      setError(null);
      setSuccess(false);
      refetch(); // 🔹 Kategóriák frissítése megnyitáskor
    }
  }, [opened, refetch]);

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      setError("A kategória neve nem lehet üres!");
      return;
    }

    createCategory(newCategory, {
      onSuccess: () => {
        setSuccess(true);
        setError(null);
        setNewCategory("");
        refetch(); // 🔹 Kategóriák frissítése sikeres hozzáadás után
        setTimeout(() => setSuccess(false), 2000); // 🔹 Siker visszajelzés eltüntetése
      },
      onError: () => {
        setError("Hiba történt a kategória létrehozása közben!");
      },
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Kategória hozzáadása"
      centered
      size="md"
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
    >
      {/* 🔹 Új kategória mező */}
      <TextInput
        label="Új kategória neve"
        placeholder="Írd be az új kategória nevét"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        error={error}
        mt="md"
      />
      <Group mt="md" justify="space-between">
        <Button
          onClick={handleAddCategory}
          disabled={!newCategory.trim()}
          style={{ marginTop: "10px" }}
        >
          Hozzáadás
        </Button>

        {/* 🔹 Bezáró ikon */}
        <ActionIcon
          onClick={onClose}
          style={{ position: "absolute", top: 12, right: 12 }}
        >
          <IconX size={18} />
        </ActionIcon>
      </Group>

      {/* 🔹 Siker üzenet */}
      {success && (
        <Text color="green" mt="sm">
          <IconCircleCheck size={16} style={{ marginRight: 5 }} />
          Sikeresen hozzáadva!
        </Text>
      )}

      {/* 🔹 Kategória lista */}
      <div style={{ marginTop: "20px" }}>
        <Text size="sm" fw={500} mb="xs">
          Létező kategóriák:
        </Text>
        {isLoading ? (
          <Loader size="sm" />
        ) : categories ? (
          <List spacing="xs" size="sm" withPadding>
            {categories.map((category) => (
              <List.Item key={category.id}>{category.name}</List.Item>
            ))}
          </List>
        ) : (
          <Text size="sm" color="dimmed">
            Nincsenek kategóriák.
          </Text>
          )}
      </div>
    </Modal>
  );
};

export default AddCategoryModal;
