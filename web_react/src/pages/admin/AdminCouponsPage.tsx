import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  TextInput,
  NumberInput,
  Checkbox,
  Group,
  ActionIcon,
  Text,
  Divider,
  Badge,
  Container
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates'; // ✅ Helyes import!
import { IconTrash, IconPlus } from '@tabler/icons-react';
import { useCoupon } from '../../hooks/useCoupon';
import { CouponService } from '../../services/CouponService';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import AdminBar from './AdminBar';

const AdminCouponsPage = () => {
  const { coupons: initialCoupons, loading, error } = useCoupon();
const [coupons, setCoupons] = useState(initialCoupons || []);
  const [modalOpen, setModalOpen] = useState(false);

  // Új kuponhoz állapot
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [validFrom, setValidFrom] = useState<Date | null>(null);
  const [validUntil, setValidUntil] = useState<Date | null>(null);
  const [firstOrderOnly, setFirstOrderOnly] = useState(false);


  useEffect(() => {
    if (initialCoupons) {
      setCoupons(initialCoupons);
    }
  }, [initialCoupons]);

  // 🔄 Új kupon hozzáadása
  const handleCreateCoupon = async () => {
    try {
      const newCoupon = {
        code,
        discountPercentage,
        validFrom: validFrom ? validFrom.toISOString() : null,
        validUntil: validUntil ? validUntil.toISOString() : null,
        firstOrderOnly,
      };
      const created = await CouponService.createCoupon(newCoupon);
      setCoupons((prev) => [...prev, created]);
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Hiba a kupon létrehozásakor:', error);
    }
  };

  // 🗑️ Kupon törlése
  const handleDeleteCoupon = async (id: number) => {
    try {
      await CouponService.deleteCoupon(id);
      setCoupons((prev) => prev.filter(coupon => coupon.id !== id));
    } catch (error) {
      console.error('Hiba a kupon törlésekor:', error);
    }
  };

  // Form visszaállítása
  const resetForm = () => {
    setCode('');
    setDiscountPercentage(0);
    setValidFrom(null);
    setValidUntil(null);
    setFirstOrderOnly(false);
  };

  return (
    <Container size="xl" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
      <AdminBar />
      <div style={{ padding: '20px' }}>
        {/* FEJLÉC */}
        <Group justify="space-between" mb="md">
          <Text size="xl" fw={700}>
            Kuponok kezelése
          </Text>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => setModalOpen(true)}
          >
            Új kupon hozzáadása
          </Button>
        </Group>

        <Divider mb="md" />

        {/* Hibaüzenet megjelenítése */}
        {error && (
          <Text color="red" mb="md">
            {error}
          </Text>
        )}

        {/* Kuponok listája */}
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Kód</th>
              <th>Kedvezmény (%)</th>
              <th>Érvényesség</th>
              <th>Első rendeléshez</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td>{coupon.code}</td>
                <td>{coupon.discountPercentage}%</td>
                <td>
                  {coupon.validFrom && coupon.validUntil ? (
                    `${new Date(coupon.validFrom).toLocaleDateString()} - ${new Date(
                      coupon.validUntil
                    ).toLocaleDateString()}`
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  {coupon.firstOrderOnly ? (
                    <Badge color="blue">Első rendeléshez</Badge>
                  ) : (
                    <Badge color="gray">Bármikor</Badge>
                  )}
                </td>
                <td>
                  <ActionIcon color="red" onClick={() => handleDeleteCoupon(coupon.id)}>
                    <IconTrash size={18} />
                  </ActionIcon>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* ✅ Új kupon létrehozása */}
        <Modal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Új kupon létrehozása"
          centered
        >
          <TextInput
            label="Kuponkód"
            value={code}
            onChange={(e) => setCode(e.currentTarget.value)}
          />
          <NumberInput
            label="Kedvezmény (%)"
            value={discountPercentage}
            onChange={(value) => setDiscountPercentage(Number(value) || 0)} // ✅ Javított típus!
          />
          <DatePickerInput
            label="Érvényesség kezdete"
            value={validFrom}
            onChange={setValidFrom}
          />
          <DatePickerInput
            label="Érvényesség vége"
            value={validUntil}
            onChange={setValidUntil}
          />
          <Checkbox
            label="Első rendeléshez érvényes"
            checked={firstOrderOnly}
            onChange={(e) => setFirstOrderOnly(e.currentTarget.checked)}
            mt="md"
          />
          <Group mt="md" justify="space-between">
            <Button onClick={resetForm} variant="default">
              Mégse
            </Button>
            <Button color="green" onClick={handleCreateCoupon}>
              Mentés
            </Button>
          </Group>
        </Modal>
      </div>
      </Container>
      );
};

      export default AdminCouponsPage;
