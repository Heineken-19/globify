import { useCart } from "../context/CartContext";
import { Avatar, Popover, Paper, Text, Button, Group, ActionIcon, rem, Image, Divider } from "@mantine/core";
import { IconShoppingCart, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDropdown } from "../context/DropdownContext";
import { API_URL } from '../config/config';
import InfoBar from './InfoBar';

const FREE_SHIPPING_THRESHOLD = 20000;

export default function CartComponent() {
  const { cart, removeFromCart } = useCart();
  const { openDropdown, setOpenDropdown } = useDropdown();
  const navigate = useNavigate();
  const location = useLocation();
  

 
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isCartPage = location.pathname === "/cart";
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalAmount);

  const handleOpen = () => {
    if (openDropdown === "cart") {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(null);
      setTimeout(() => setOpenDropdown("cart"), 10);
    }
  };

  return (
    <Popover opened={!isCartPage && openDropdown === "cart"} onClose={() => setOpenDropdown(null)} position="bottom-end" withArrow={false} shadow="none" zIndex={1100} withinPortal={false}  trapFocus={false}>
      <Popover.Target>
        <Avatar radius="xl" onClick={handleOpen} style={{ cursor: "pointer" }}>
          <IconShoppingCart size={24} color="#000000" />
        </Avatar>
      </Popover.Target>

      <Popover.Dropdown>
      {cart.length > 0 && (
          <InfoBar amountToFreeShipping={amountToFreeShipping} />
        )}
        <Divider style={{ margin: "4px 0" }} />
        <Paper p={0} radius="lg" style={{ width: rem(350), maxHeight: rem(350), borderRadius: rem(20), padding: 0, display: "flex", flexDirection: "column" }}>
          <Text fw={600} size="md" p={10}>Kosár</Text>

          <div style={{ flexGrow: 1, maxHeight: cart.length > 4 ? rem(250) : "auto", overflowY: cart.length > 4 ? "auto" : "visible", padding: rem(15) }}>
            {cart.length > 0 ? (
              cart.map((item) => {
                const imageUrl = item.imageUrls && item.imageUrls.length > 0
                ? `${API_URL}/uploads/${item.imageUrls[0]}`
                : `${API_URL}/uploads/default.jpg`;
                  
              return (
                <Group key={item.id} style={{ justifyContent: "space-between", marginBottom: rem(10) }}>
                  <Image
                    src={imageUrl}
                    width={50}
                    height={50}
                    radius="md"
                    alt={item.name}
                  />

                  <div style={{ flexGrow: 1 }}>
                    <Text 
                    size="sm" 
                    fw={500}
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis", // Hosszú név levágása
                        maxWidth: rem(150), // Maximum szélesség beállítása
                        }}>
                          {item.name}
                          </Text>
                    <Text size="xs" color="dimmed">{item.price.toLocaleString()} Ft x {item.quantity}</Text>
                  </div>

                  <ActionIcon size="sm" color="red" onClick={() => removeFromCart(item.id)}>
                    <IconTrash size={14} />
                  </ActionIcon>
                </Group>
                );
              })
            ) : (
              <Text size="sm" color="dimmed" style={{ textAlign: "center" }}>A kosár üres.</Text>
            )}
          </div>

          {cart.length > 0 && (
            <div style={{ padding: rem(5), borderTop: "1px solid #ddd", background: "#fff" }}>
            <Group justify="apart" mt="sm" px="sm" m={6}>
              <Text size="sm" fw={500}>Végösszeg: {cart.length} termék</Text>
              <Text size="sm" fw={700} style={{ textAlign: "right", flexGrow: 1 }}>{totalAmount.toLocaleString()} Ft</Text>
            </Group>
            <Button fullWidth color="green" onClick={() => navigate("/cart")}>Megrendelés</Button>
          </div>
          )}
        </Paper>
      </Popover.Dropdown>
    </Popover>
  );
}
