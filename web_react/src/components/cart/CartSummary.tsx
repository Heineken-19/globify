import React, { useState, useEffect } from 'react';
import { Table, Avatar, Text, Button, NumberInput, ActionIcon, Paper, Group, Divider, TextInput, rem } from '@mantine/core';
import { IconTrash, IconCheck, IconX } from '@tabler/icons-react';
import { API_URL } from '../../config/config';
import { useMediaQuery } from '@mantine/hooks';
import { formatPrice } from '../../utils/formatPrice';
import { useNavigate } from 'react-router-dom';


interface Props {
  cart: any[];
  subtotal: number;
  couponCode: string;
  couponMessage: string | null;
  setCouponCode: (code: string) => void;
  handleApplyCoupon: () => void;
  handleClearCoupon: () => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  discount: number;
  setDiscount: (value: number) => void;
  usedPoints: number;
  setUsedPoints: (value: number) => void;
  availablePoints: number;
  onNext: () => void;
}

const CartSummary: React.FC<Props> = ({
  cart,
  subtotal,
  couponCode,
  couponMessage,
  setCouponCode,
  handleApplyCoupon,
  handleClearCoupon,
  updateQuantity,
  removeFromCart,
  discount,
  usedPoints,
  setUsedPoints,
  availablePoints,
  onNext,
}) => {
  const [isEmpty, setIsEmpty] = useState<boolean>(cart.length === 0);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();


 useEffect(() => {
  setIsEmpty(cart.length === 0);

  if (cart.length === 0) {
    const timer = setTimeout(() => {
      navigate('/products');
    }, 3000);

    return () => clearTimeout(timer); 
  }
}, [cart, navigate]);

  return (
    <div
      style={{
        display: isMobile ? 'block' : 'flex',
        gap: isMobile ? '20px' : '40px',
        padding: isMobile ? '10px' : '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* ✅ Kosár tartalma */}
      <Paper
        shadow="sm"
        p={isMobile ? 'md' : 'lg'}
        style={{
          flex: isMobile ? 'auto' : 3,
          width: isMobile ? '100%' : undefined,
        }}
      >
        {isEmpty ? (
          <Text
            size={isMobile ? 'md' : 'lg'}
            fw={500}
            style={{
              textAlign: 'center',
              color: '#888',
            }}
          >
            A kosár üres, vissza navigálunk a termékek oldalra...
          </Text>
        ) : (
          <>
            {!isMobile ? (
              // ✅ Asztali nézet - táblázatos megjelenítés
              <Table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {cart.map((item, index) => (
                    <React.Fragment key={item.id || index}>
                      <tr key={item.id || index}>
                        <td style={{ width: '80px' }}>
                          <Avatar
                            src={
                              item.imageUrls?.[0]
                                ? `${API_URL}/uploads/products/${item.imageUrls[0]}`
                                : `${API_URL}/uploads/products/default.jpg`
                            }
                          />
                        </td>
                        <td style={{ textAlign: 'left', paddingLeft: '20px' }}>
                          {item.name}
                        </td>
                        <td>
                          <Text>Mennyiség:</Text>
                          <NumberInput
                            value={item.quantity}
                            min={1}
                            onChange={(value) =>
                              updateQuantity(item.id, Number(value) || 1)
                            }
                            size="xs"
                            style={{ width: 60, textAlign: 'center' }}
                          />
                        </td>
                        <td>{item.quantity > 1 ? `${formatPrice(item.price)} /db` : ''}</td>
                        <td>{formatPrice(item.price * item.quantity)}</td>
                        <td>
                          <ActionIcon color="red" onClick={() => removeFromCart(item.id)}>
                            <IconTrash size={16} />
                          </ActionIcon>
                        </td>
                      </tr>
                      {index < cart.length - 1 && (
                        <tr>
                          <td colSpan={6}>
                            <Divider my="sm" />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            ) : (
              // ✅ Mobil nézet - Kártyás megjelenítés
              <>
                {cart.map((item) => (
                  <Paper
                    key={item.id}
                    shadow="sm"
                    p="sm"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: rem(10),
                      gap: rem(10),
                    }}
                  >
                    <Avatar
                      src={
                        item.imageUrls?.[0]
                          ? `${API_URL}/uploads/products/${item.imageUrls[0]}`
                          : `${API_URL}/uploads/products/default.jpg`
                      }
                      size={40}
                    />
                    <div style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>
                        {item.name}
                      </Text>
                      <Text size="xs" color="dimmed">
                      {formatPrice(item.price)} x {item.quantity}
                      </Text>
                    </div>
                    <ActionIcon size="sm" color="red" onClick={() => removeFromCart(item.id)}>
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Paper>
                ))}
              </>
            )}
          </>
        )}
      </Paper>

      {/* ✅ Rendelés összegzés */}
      <Paper
        shadow="sm"
        p={isMobile ? 'md' : 'lg'}
        style={{
          flex: isMobile ? 'auto' : 1,
          width: isMobile ? '100%' : undefined,
        }}
      >
        <Text size={isMobile ? 'md' : 'lg'} fw={500}>
          Rendelés összegzés
        </Text>
        <Divider my="sm" />
        <Group justify="space-between">
          <Text>Részösszeg:</Text>
          <Text>{formatPrice(subtotal)}</Text>
        </Group>

        {discount > 0 && (
          <Group justify="space-between">
            <Text color="orange">Kedvezmény:</Text>
            <Text color="orange">- {formatPrice(discount)}</Text>
          </Group>
        )}

        {usedPoints > 0 && (
          <Group justify="space-between">
            <Text color="blue">Hűségpont:</Text>
            <Text color="blue">- {formatPrice(usedPoints)}</Text>
          </Group>
        )}

        <Divider my="sm" />
        <Group justify="space-between">
          <Text fw={700}>Végösszeg:</Text>
          <Text fw={700}>{formatPrice(subtotal - discount - usedPoints)}</Text>
        </Group>

        {availablePoints > 0 && (
          <>
            <Divider my="sm" />
            <Text>Hűségpont felhasználása:</Text>
            <NumberInput
              min={0}
              max={availablePoints}
              step={10}
              value={usedPoints}
              onChange={(value) => setUsedPoints(Number(value) || 0)}
              description={`Elérhető: ${availablePoints} pont (1 pont = 1 Ft)`}
            />
            {usedPoints > 0 && (
              <Text size="sm" color="dimmed">
                Levonás: {formatPrice(usedPoints)}
              </Text>
            )}
          </>
        )}

        <TextInput
          value={couponCode}
          mt="sm"
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Vásárlási utalvány kódja"
          error={couponMessage?.includes("❌") ? couponMessage : undefined}
          style={{ flexGrow: 1 }}
          rightSection={
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '20px' }}>
              <ActionIcon color="green" size="sm" onClick={handleApplyCoupon}>
                <IconCheck size={16} />
              </ActionIcon>
              <ActionIcon color="red" size="sm" onClick={handleClearCoupon}>
                <IconX size={16} />
              </ActionIcon>
            </div>
          }
        />

        <Button fullWidth mt="md" color="green" onClick={onNext}>
          Tovább
        </Button>
      </Paper>
    </div>
  );
};

export default CartSummary;
