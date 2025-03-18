import React, { useEffect, useState } from 'react';
import { Paper, Text, Divider, Select, TextInput, Button, Group } from '@mantine/core';
import { useBilling } from '../../hooks/useBilling';
import type { Billing } from '../../services/BillingService';

interface Props {
  selectedBilling: string | null;
  setSelectedBilling: (value: string | null) => void;
  billingData: any;
  setBillingData: (data: any) => void;
  handleSaveBilling: () => Promise<void>; // ✅ Javítva
  onPrev: () => void;
  onNext: () => void;
}

const BillingStep: React.FC<Props> = ({
  selectedBilling,
  setSelectedBilling,
  billingData,
  setBillingData,
  onNext,
  onPrev
}) => {
  const { billings, addBilling } = useBilling();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedBilling === 'new') {
      setBillingData({
        companyName: '',
        taxNumber: null,
        street: '',
        city: '',
        postalCode: '',
        country: '',
        billingType: ''
      });
    } else if (selectedBilling && billings?.data) {
      const selected = billings.data.find((b) => b.id?.toString() === selectedBilling);
      if (selected) setBillingData(selected);
    }
  }, [selectedBilling, billings, setBillingData]);

  const handleSaveBilling = async () => {
    try {
      setIsLoading(true);
      await addBilling.mutateAsync(billingData);
      setSelectedBilling(null);
      setError(null);
    } catch (err) {
      setError('Hiba történt a számlázási cím mentésekor!');
      console.error('Hiba:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isNextDisabled =
    !billingData.companyName ||
    !billingData.street ||
    !billingData.city ||
    !billingData.postalCode ||
    !billingData.country;

  return (
    <Paper shadow="sm" p="lg" mt="lg">
      <Text size="lg" fw={500}>Számlázási adatok</Text>
      <Divider my="sm" />

      {/* Korábbi számlázási cím kiválasztása */}
      <Select
        label="Válassz egy számlázási címet"
        data={[
          { value: 'new', label: '+ Új cím hozzáadása' },
          ...(billings?.data?.map((b) => ({
            value: b.id?.toString() || '',
            label: b.companyName
          })) || [])
        ]}
        value={selectedBilling}
        onChange={setSelectedBilling}
      />

      {/* Új számlázási cím adatainak bevitele */}
      <TextInput
        required
        label="Cégnév / Számlázási név"
        value={billingData.companyName}
        onChange={(e) =>
          setBillingData({ ...billingData, companyName: e.target.value })
        }
      />

      <TextInput
        label="Adószám (opcionális)"
        value={billingData.taxNumber || ''}
        onChange={(e) =>
          setBillingData({ ...billingData, taxNumber: e.target.value || null })
        }
      />

      <TextInput
        required
        label="Utca, házszám"
        value={billingData.street}
        onChange={(e) =>
          setBillingData({ ...billingData, street: e.target.value })
        }
      />

      <TextInput
        required
        label="Város"
        value={billingData.city}
        onChange={(e) =>
          setBillingData({ ...billingData, city: e.target.value })
        }
      />

      <TextInput
        required
        label="Irányítószám"
        value={billingData.postalCode}
        onChange={(e) =>
          setBillingData({ ...billingData, postalCode: e.target.value })
        }
      />

      <TextInput
        required
        label="Ország"
        value={billingData.country}
        onChange={(e) =>
          setBillingData({ ...billingData, country: e.target.value })
        }
      />

      {/* Új cím mentése */}
      {selectedBilling === 'new' && (
        <Button
          mt="md"
          color="blue"
          onClick={handleSaveBilling}
          loading={isLoading}
        >
          Új cím mentése
        </Button>
      )}

      {error && (
        <Text color="red" mt="sm">
          {error}
        </Text>
      )}

      <Group mt="md" justify="space-between">
        <Button color="gray" onClick={onPrev}>
          Vissza
        </Button>
        <Button color="green" disabled={isNextDisabled} onClick={onNext}>
          Tovább
        </Button>
      </Group>
    </Paper>
  );
};

export default BillingStep;
