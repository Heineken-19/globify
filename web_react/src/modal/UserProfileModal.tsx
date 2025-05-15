import { Modal, TextInput, Button, Group, Text, Paper } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { DatePickerInput } from '@mantine/dates';
import { useFavoritePickup,  FoxPostPoint } from "../hooks/useFavoritePickup";
import { useNotification } from '../context/NotificationContext';
import dayjs from 'dayjs';
import FoxPostSelectorSmall from '../selector/FoxPostSelectorSmall';
import { useModal } from "../context/ModalContext";


interface FormData {
    pickupPoint?: string;
    country?: string;
    city?: string;
    zip?: string;
    street?: string;
    firstName?: string;
    lastName?: string;
    nickname?: string;
    birthDate?: string;
    phone?: string;
    password?: string;
    email?: string;
}

interface UserProfileModalProps {
    opened: boolean;
    onClose: () => void;
    type: 'pickupPoint' | 'deliveryAddress' | 'billingAddress' | 'profile';
    data?: FormData;
    onSave: (data: FormData) => void;
}

const UserProfileModal = ({ opened, onClose, type, data, onSave }: UserProfileModalProps) => {
    const { user, updateUser } = useUser();
    const [formData, setFormData] = useState<FormData>(data || {});
    const { favoritePoint, saveFavorite, refetchFavoritePickupPoint } = useFavoritePickup();
    const [showPickupModal, setShowPickupModal] = useState(false);
    const { showSuccess, showError } = useNotification();
    const { setModalOpen } = useModal();

    useEffect(() => {
        setModalOpen(opened); // amikor nyitva van, állítsd be
      }, [opened]);

    useEffect(() => {
        if (type === "pickupPoint" && favoritePoint?.name) {
            setFormData((prev) => ({
                ...prev,
                pickupPoint: favoritePoint.name,
            }));
        }
    }, [type, favoritePoint?.name]);

    useEffect(() => {
        if (type === 'profile' && user) {
            setFormData(user);
        }
    }, [type, user]);

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData((prev: FormData) => ({ ...prev, [field]: value }));
    };
    const handleSave = async () => {
        try {
        if (type === 'profile') {
            await updateUser(formData);
            showSuccess('Profiladatok sikeresen mentve!');
        }
        onSave(formData);
        onClose();
    } catch (error) {
        showError('Hiba történt az adatok mentése során.');
    }
    };

    const handlePickupPointChange = async (point: FoxPostPoint) => {
        try {
            await saveFavorite(point);
            await refetchFavoritePickupPoint(); // ✅ Sikeres mentés
            setFormData((prev) => ({
                ...prev,
                pickupPoint: point.name,
            }));

            showSuccess('✅ Kedvenc átvételi pont sikeresen mentve!');
        } catch (error) {
            showError('❌ Hiba a kedvenc átvételi pont mentése során.');
        } finally {
            setShowPickupModal(false);
        }
    };

    return (
        <>
        <Modal opened={opened} onClose={onClose} centered title={
            type === 'pickupPoint' ? 'Kedvenc átvételi pont módosítása' :
                type === 'deliveryAddress' ? 'Kézbesítési cím módosítása' :
                    type === 'billingAddress' ? 'Számlázási cím módosítása' :
                        'Profiladatok módosítása'
        }>
            {type === 'pickupPoint' && (
                <>
               {favoritePoint ? (
                            <Paper shadow="xs" p="md" mb="md">
                                <Text fw={600}>Jelenlegi kedvenc pont:</Text>
                                <Text>{favoritePoint.name}</Text>
                                <Text>{favoritePoint.city}, {favoritePoint.zip}</Text>
                                <Text>{favoritePoint.address}</Text>
                                <Button mt="md" onClick={() => setShowPickupModal(true)}>
                                    Módosítás
                                </Button>
                            </Paper>
                        ) : (
                            <Paper shadow="xs" p="md" mb="md">
                                <Text fw={600}>Jelenlegi kedvenc pont:</Text>
                                <Text color="dimmed">Nincs beállított kedvenc átvételi pont</Text>
                                <Button mt="md" onClick={() => setShowPickupModal(true)}>
                                    Csomagpont kiválasztása
                                </Button>
                            </Paper>
                        )}
                </>
            )}

            {(type === 'deliveryAddress' || type === 'billingAddress') && (
                <>
                    <TextInput
                        label="Ország"
                        value={formData.country || ''}
                        onChange={(e) => handleChange('country', e.target.value)}
                    />
                    <TextInput
                        label="Város"
                        value={formData.city || ''}
                        onChange={(e) => handleChange('city', e.target.value)}
                    />
                    <TextInput
                        label="Irányítószám"
                        value={formData.zip || ''}
                        onChange={(e) => handleChange('zip', e.target.value)}
                    />
                    <TextInput
                        label="Utca, házszám"
                        value={formData.street || ''}
                        onChange={(e) => handleChange('street', e.target.value)}
                    />
                </>
            )}

            {type === 'profile' && (
                <>
                    <TextInput
                        label="Email cím"
                        value={formData.email || ''}
                        disabled
                    />
                    <TextInput
                        label="Keresztnév"
                        value={formData.firstName || ''}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                    />
                    <TextInput
                        label="Vezetéknév"
                        value={formData.lastName || ''}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                    />
                    <TextInput
                        label="Becenév"
                        value={formData.nickname || ''}
                        onChange={(e) => handleChange('nickname', e.target.value)}
                    />
                    <DatePickerInput
                        label="Születési idő"
                        value={formData.birthDate ? dayjs(formData.birthDate).toDate() : null}
                        onChange={(date) => handleChange('birthDate', date ? dayjs(date).format('YYYY-MM-DD') : '')}
                        maxDate={new Date()}
                        allowDeselect
                        clearable
                        valueFormat="YYYY-MM-DD"
                        dropdownType="popover"
                        popoverProps={{ withinPortal: true }}
                        placeholder="Válassz dátumot"
                    />
                    <TextInput
                        label="Telefonszám"
                        value={formData.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                    />
                </>
            )}

            <Group justify="right" mt="md">
                <Button onClick={onClose} color="gray">Mégse</Button>
                <Button onClick={handleSave} color="blue">Mentés</Button>
            </Group>
        </Modal>

        <Modal 
                opened={showPickupModal}
                onClose={() => setShowPickupModal(false)}
                centered
                size="lg"
                title="Csomagpont kiválasztása"
            >
                <FoxPostSelectorSmall 
                    setSelectedPoint={handlePickupPointChange}
                    onClose={() => setShowPickupModal(false)}
                />
            </Modal>
        </>
    );
};

export default UserProfileModal;