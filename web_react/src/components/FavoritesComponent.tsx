import { useLocation } from "react-router-dom";
import { Text, Image, Group, Paper, Avatar, Divider, ActionIcon, Tooltip, Popover, rem } from "@mantine/core";
import { IconHeart, IconTrash } from "@tabler/icons-react";
import { useFavorite } from "../context/FavoriteContext";
import { useDropdown } from "../context/DropdownContext";
import { API_URL } from '../config/config';

export default function FavoritesComponent() {
  const { favorites, removeFavorite } = useFavorite();
  const { openDropdown, setOpenDropdown } = useDropdown();
  const baseUrl = `${API_URL}/uploads/`;
  const location = useLocation();

  const isDisabled = location.pathname === "/profile/favorites";

  const handleClick = () => {
    if (isDisabled) return;
    if (openDropdown === "favorites") {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(null);
      setTimeout(() => setOpenDropdown("favorites"), 10);
    }
  };

  return (
    <Popover opened={openDropdown === "favorites"} onClose={() => setOpenDropdown(null)} position="bottom-end" offset={10} withArrow shadow="md" zIndex={1100}  withinPortal={false}  trapFocus={false} >
      <Popover.Target>
        <Avatar radius="xl" onClick={handleClick} style={{ cursor: isDisabled ? "not-allowed" : "pointer", marginLeft: rem(2) }} >
          <IconHeart size={24} color="#000000" />
        </Avatar>
      </Popover.Target>

      <Popover.Dropdown>
        <Paper  radius="lg"  style={{ width: rem(320), maxHeight: rem(470), borderRadius: rem(20), padding: rem(10), background: "#fff", display: "flex", flexDirection: "column", position: "relative", overflowX: "hidden" }}>
          <Group justify="center" style={{  textAlign: "center" }}>
            <Text  size="md" style={{ fontWeight: 600 }}>
              <IconHeart size={20} color="red" style={{  textAlign: "center" }} /> Kedvenceim
            </Text>
          </Group>

          {favorites.length > 0 ? (
            favorites.map((product) => (
              <div key={product.id} style={{ margin: "0px 0" }}>
                <Divider  style={{ borderTop: "1px solid #ccc", width: "90%", margin: "auto", marginTop: 5 }} />

                <div style={{ display: "flex", alignItems: "center", gap: rem(10), overflowX: "hidden", minWidth: 0, padding: `0 ${rem(10)}` }}>
                  <Image  src={product.imageUrls?.length > 0 ? `${baseUrl}${product.imageUrls[0]}` : `${baseUrl}default.jpg`}
                   width={50} 
                   height={50}
                    radius="md" 
                    alt={product.name} 
                    style={{ objectFit: "cover", display: "block", flexShrink: 0 }} />
                  
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                    <Text size="sm" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500 }}>
                    {product.name || "Nincs név"}
                    </Text>
                    <Text size="xs" color="dimmed">{product.price ? `${product.price} Ft` : "Ár nem elérhető"}</Text>
                  </div>

                  <Tooltip label="Eltávolítás" withArrow>
                    <ActionIcon color="red" onClick={() => removeFavorite(product.id)} size="md">
                      <IconTrash size={rem(18)} />
                    </ActionIcon>
                  </Tooltip>
                </div>

              </div>
            ))
          ) : (
            <Text size="sm" color="dimmed" style={{ textAlign: "center", flex: 1 }}>
              Nincsenek kedvencek
            </Text>
          )}
        </Paper>
      </Popover.Dropdown>
    </Popover>
  );
}
