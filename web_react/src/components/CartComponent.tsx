import { useCart } from "../context/CartContext";
import { Avatar, Popover, Paper, Text, Button, Group, ActionIcon, rem, Image, Divider } from "@mantine/core";
import { IconShoppingCart, IconTrash } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDropdown } from "../context/DropdownContext";
import { API_URL } from '../config/config';
import InfoBar from './InfoBar';
import { useMediaQuery } from '@mantine/hooks';
import LoginModal from "../modal/LoginModal";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/formatPrice";

const FREE_SHIPPING_THRESHOLD = 20000;

export default function CartComponent() {
  const { isLoggedIn } = useAuth();
  const { cart, removeFromCart } = useCart();
  const { openDropdown, setOpenDropdown } = useDropdown();
  const navigate = useNavigate();
  const location = useLocation();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');


  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isCartPage = location.pathname === "/cart";
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalAmount);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      setOpenDropdown(null);
    } else {
      setOpenDropdown(null);
      navigate("/cart");
    }
  };

  useEffect(() => {
    const handleAuthChange = () => {
      console.log("Auth state changed - CartComponent");
      setOpenDropdown(null);
    };
  
    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    // ✅ Event listener hozzáadása
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // ✅ Event listener eltávolítása
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpen = () => {
    if (isCartPage) return;
  
    if (isMobile) {
      if (!isLoggedIn) {
        // ✅ Mobil nézetben, ha nincs bejelentkezve → modál nyitása
        setLoginModalOpen(true);
        setOpenDropdown(null);
      } else {
        // ✅ Mobilon bejelentkezve → navigálás
        navigate('/cart');
      }
    } else {
      // ✅ Asztali nézetben → dropdown működés
      if (openDropdown === "cart") {
        setOpenDropdown(null);
      } else {
        setOpenDropdown(null);
        setTimeout(() => setOpenDropdown("cart"), 10);
      }
    }
  };

  return (
    <Popover opened={!isCartPage && openDropdown === "cart"} onClose={() => setOpenDropdown(null)} position="bottom-end" withArrow={false} shadow="none" zIndex={1100} withinPortal={false} trapFocus={false}>
      <Popover.Target>
        <Avatar radius="xl" onClick={handleOpen} style={{ cursor: "pointer", width: isMobile ? rem(30) : rem(40), height: isMobile ? rem(30) : rem(40) }}>
          <IconShoppingCart size={isMobile ? 18 : 24} color="#000000" />
        </Avatar>
      </Popover.Target>

      {!isMobile && (
        <Popover.Dropdown ref={popoverRef}>
          {cart.length > 0 && (
            <InfoBar amountToFreeShipping={amountToFreeShipping} />
          )}
          <Divider style={{ margin: "4px 0" }} />

          <Paper p={0}
            radius="lg"
            style={{
              width: isMobile ? rem(280) : rem(350), // ✅ Mobil nézetben kisebb szélesség
              maxHeight: isMobile ? rem(280) : rem(350), // ✅ Mobil nézetben kisebb magasság
              padding: rem(10),
              borderRadius: rem(16),
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Text fw={600} size={isMobile ? "sm" : "md"} p={10}>Kosár</Text>

            <div style={{ flexGrow: 1, maxHeight: cart.length > 4 ? rem(180) : "auto", overflowY: cart.length > 3 ? "auto" : "visible", padding: rem(10) }}>
              {cart.length > 0 ? (
                cart.map((item) => {
                  const imageUrl = item.imageUrls && item.imageUrls.length > 0
                    ? `${API_URL}/uploads/products/${item.imageUrls[0]}`
                    : `${API_URL}/uploads/products/default.jpg`;

                  return (
                    <Group key={item.id} style={{ justifyContent: "space-between", marginBottom: rem(8) }}>
                      <Image
                        src={imageUrl}
                        width={isMobile ? 40 : 50}
                        height={isMobile ? 40 : 50}
                        radius="md"
                        alt={item.name}
                      />

                      <div style={{ flexGrow: 1 }}>
                        <Text
                          size={isMobile ? "xs" : "sm"}
                          fw={500}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis", // Hosszú név levágása
                            maxWidth: rem(150), // Maximum szélesség beállítása
                          }}>
                          {item.name}
                        </Text>
                        <Text size="xs" color="dimmed">{formatPrice(item.price)} x {item.quantity}</Text>
                      </div>

                      <ActionIcon size={isMobile ? "xs" : "sm"} color="red" onClick={() => removeFromCart(item.id)}>
                        <IconTrash size={isMobile ? 12 : 14} />
                      </ActionIcon>
                    </Group>
                  );
                })
              ) : (
                <Text size="sm" color="dimmed" style={{ textAlign: "center" }}>A kosár üres.</Text>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ borderTop: "1px solid #ddd", background: "#fff" }}>
              <div style={{ padding: rem(10) }}>
                <Group justify="apart" mb="sm">
                  <Text size="sm" fw={500}>Végösszeg: {cart.length} termék</Text>
                  <Text size="sm" fw={700}>{formatPrice(totalAmount)}</Text>
                </Group>
                <Button fullWidth color="green" onClick={handleCheckout}>
                  Megrendelés
                </Button>
              </div>
            </div>
            )}
          </Paper>
        </Popover.Dropdown>
      )}
      <LoginModal
        opened={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        setOpenDropdown={setOpenDropdown} // ✅ Prop átadása
      />
    </Popover>

  );
}
