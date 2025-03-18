import React, {useEffect} from 'react';
import {
  Paper,
  Text,
  Divider,
  Radio,
  Group,
  TextInput,
  Button,
} from '@mantine/core';
import FoxPostSelector from '../../selector/FoxPostSelector';
import { FoxpostPoint } from '../../types';
import { useFavoritePickup } from "../../hooks/useFavoritePickup";
import { CartItem } from '../../types';

interface Props {
  cart: CartItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (value: string) => void;
  selectedShippingMethod: string;
  setSelectedShippingMethod: (value: string) => void;
  selectedShippingPoint: FoxpostPoint | null;
  setSelectedShippingPoint: (value: FoxpostPoint | null) => void;
  homeDeliveryAddress: string;
  setHomeDeliveryAddress: (value: string) => void;
  cashOnShopAddress: string;
  onPrev: () => void;
  onNext: () => void;
  fetchShippingCost: (method: string) => void;
}

const ShippingStep: React.FC<Props> = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  selectedShippingMethod,
  setSelectedShippingMethod,
  setSelectedShippingPoint,
  homeDeliveryAddress,
  setHomeDeliveryAddress,
  cashOnShopAddress,
  onPrev,
  onNext,
  fetchShippingCost,
}) => {
  const { favoritePoint } = useFavoritePickup();

  useEffect(() => {
    if (favoritePoint) {
      setSelectedShippingPoint(favoritePoint);
    }
  }, [favoritePoint]);

  useEffect(() => {
    if (selectedShippingMethod) {
      fetchShippingCost(selectedShippingMethod);
    }
  }, [selectedShippingMethod]);

  return (
    <Paper shadow="sm" p="lg" mt="lg">
      {/* Szállítás és fizetés cím */}
      <Text size="lg" fw={500}>
        Szállítás és Fizetés
      </Text>
      <Divider my="sm" />

      {/* Fizetési mód */}
      <Text size="md" fw={500} mb="xs">
        Fizetési mód
      </Text>
      <Radio.Group
        value={selectedPaymentMethod}
        onChange={setSelectedPaymentMethod}
      >
        <Radio value="bankcard" label="Bankkártyás fizetés" />
        <Radio value="cash" label="Utánvét" />
        <Radio value="transfer" label="Átutalás" />
      </Radio.Group>

      <Divider my="sm" />

      {/* Szállítási mód */}
      <Text size="md" fw={500} mb="xs">
        Szállítási mód
      </Text>
      <Radio.Group
        value={selectedShippingMethod}
        onChange={(value) => {
          setSelectedShippingMethod(value);
          setSelectedShippingPoint(null);
          localStorage.removeItem('selectedShippingPoint');
        }}
      >
        <Radio value="home" label="Házhoz szállítás" />
        <Radio value="shop" label="Személyes átvétel az üzletben" />
        <Radio value="foxpost" label="Csomagpontra" />
      </Radio.Group>

      {/* Szállítási cím megadása - Házhoz szállítás */}
      {selectedShippingMethod === 'home' && (
        <TextInput
          label="Szállítási cím"
          value={homeDeliveryAddress}
          onChange={(e) => setHomeDeliveryAddress(e.target.value)}
          required
          mt="sm"
        />
      )}

      {/* FoxPost vagy Packeta választása */}
      {selectedShippingMethod === 'foxpost' && (
        <FoxPostSelector setSelectedPoint={setSelectedShippingPoint} />
      )}
      {/* Átvétel címének megjelenítése - Személyes átvétel */}
      {selectedShippingMethod === 'shop' && (
        <Text mt="sm" color="gray">
          Átvétel címe: {cashOnShopAddress}
        </Text>
      )}

      {/* Gombok */}
      <Group mt="md" justify="space-between">
        <Button color="gray" onClick={onPrev}>
          Vissza
        </Button>
        <Button color="green" onClick={onNext} disabled={!selectedShippingMethod}>
          Tovább
        </Button>
      </Group>
    </Paper>
  );
};

export default ShippingStep;
