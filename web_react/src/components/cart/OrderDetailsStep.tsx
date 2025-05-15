import React from 'react';
import { Paper, Text, Divider, Table, Group, Button } from '@mantine/core';
import { FoxpostPoint } from '../../types';
import { CartItem } from '../../types';
import { formatPrice } from '../../utils/formatPrice';

interface Props {
  cart: CartItem[];
  subtotal: number;
  total: number; // ✅ Hiányzó total hozzáadása
  discount: number;
  shippingCost: number;
  selectedPaymentMethod: string;
  selectedShippingMethod: string;
  selectedShippingPoint: FoxpostPoint | null;
  homeDeliveryAddress: string;
  cashOnShopAddress: string; // ✅ Hiányzó cashOnShopAddress hozzáadása
  bankTransferAccount: string; // ✅ Hiányzó bankTransferAccount hozzáadása
  onPrev: () => void; // ✅ Hiányzó onPrev hozzáadása
  onSubmit: () => void; // ✅ Hiányzó onSubmit hozzáadása
  loading: boolean; // ✅ Hiányzó loading hozzáadása
  usedPoints: number;
}

const OrderDetailsStep: React.FC<Props> = ({
  cart,
  total,
  discount,
  selectedPaymentMethod,
  selectedShippingMethod,
  selectedShippingPoint,
  homeDeliveryAddress,
  cashOnShopAddress,
  bankTransferAccount,
  shippingCost,
  onPrev,
  onSubmit,
  loading,
  usedPoints
}) => {
  return (
    <Paper shadow="sm" p="lg" mt="lg">
      <Text size="lg" fw={500}>
        Rendelés részletei
      </Text>
      <Divider my="sm" />

      {/* Termékek listája */}
      <Text size="md" fw={500} mb="sm">
        Termékek
      </Text>
      <Table>
        <tbody>

          {cart.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity} db</td>
              <td>{formatPrice(item.price * item.quantity)}</td>
            </tr>


          ))}
          {discount > 0 && (
            <>
              <tr>
                <td colSpan={3}>
                  <div
                    style={{
                      borderTop: '1px solid #ccc', // Vékony vonal
                      margin: '8px 0',
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ color: 'orange' }}>Kedvezmény:</td>
                <td></td>
                <td style={{ color: 'orange' }}>
                  - {formatPrice(discount)}
                </td>
              </tr>
            </>
          )}
          {usedPoints > 0 && (
            <>
              <tr>
                <td colSpan={3}>
                  <div
                    style={{
                      borderTop: '1px solid #ccc',
                      margin: '8px 0',
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td style={{ color: 'blue' }}>Hűségpont levonás:</td>
                <td>{usedPoints} pont</td>
                <td style={{ color: 'blue' }}>- {formatPrice(usedPoints)}</td>
              </tr>
            </>
          )}
          <tr>
            <td colSpan={3}>
              <div
                style={{
                  borderTop: '1px solid #ccc', // Vékony vonal
                  margin: '8px 0',
                }}
              />
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold' }}>Termékek ára:</td>
            <td></td>
            <td style={{ fontWeight: 'bold' }}>
              {formatPrice(
                cart.reduce((sum, item) => sum + item.price * item.quantity, 0) -
                discount - usedPoints
              )}
            </td>
          </tr>
        </tbody>
      </Table>
      <Divider my="sm" />

      {/* Fizetési mód */}
      <Text size="md" fw={500} mb="xs">
        Fizetési mód
      </Text>
      <Text>
        {selectedPaymentMethod === 'bankcard'
          ? 'Bankkártyás fizetés'
          : selectedPaymentMethod === 'cash'
            ? 'Utánvét'
            : 'Átutalás'}
      </Text>

      {selectedPaymentMethod === 'cash' && (
        <Text>Utánvét címe: {cashOnShopAddress}</Text>
      )}
      {selectedPaymentMethod === 'transfer' && (
        <Text>Átutalási adatok: {bankTransferAccount}</Text>
      )}

      <Divider my="sm" />

      {/* Szállítási mód */}
      <Text size="md" fw={500} mb="xs">
        Szállítási mód
      </Text>
      <Text>
        {selectedShippingMethod === 'home'
          ? `Házhoz szállítás - Cím: ${homeDeliveryAddress || 'Nincs megadva'
          }`
          : selectedShippingMethod === 'shop'
            ? `Személyes átvétel - Cím: ${cashOnShopAddress}`
            : selectedShippingPoint
              ? `${selectedShippingMethod === 'foxpost'
                ? 'FoxPost:'
                : 'Packeta:'
              } ${selectedShippingPoint.name}`
              : 'Nincs kiválasztva'}
      </Text>

      <Divider my="sm" />

      <Group justify="apart">
        <Text>Szállítási költség:</Text>
        <Text>{shippingCost ? `${formatPrice(shippingCost)}` : 'Ingyenes'}</Text>
      </Group>

      <Group justify="space-between" mt="md">
        <Text size="md" fw={500}>
          Végösszeg:
        </Text>
        <Text size="md" fw={500}>
          {formatPrice(total)}
        </Text>
      </Group>

      {/* Gombok */}
      <Group mt="md" justify="space-between">
        <Button color="gray" onClick={onPrev}>
          Vissza
        </Button>
        <Button color="green" onClick={onSubmit} loading={loading}>
          {loading ? 'Fizetés indítása...' : 'Rendelés megerősítése'}
        </Button>
      </Group>
    </Paper>
  );
};

export default OrderDetailsStep;
