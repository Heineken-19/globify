import { useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Select,
    NumberInput,
    Group,
    ActionIcon,
    Text,
    Divider,
    Badge,
    Container
} from '@mantine/core';
import { IconTrash, IconEdit, IconPlus } from '@tabler/icons-react';
import { useAdminShipping } from '../../hooks/admin/useAdminShipping';
import AdminBar from './AdminBar';
import { ShippingOption, ShippingOptionInput } from '../../types';


const AdminShipping = () => {
    const {
        shippingOptions,
        shippingMethods,
        createShippingOption,
        updateShippingOption,
        deleteShippingOption,
        loading,
        error,
    } = useAdminShipping();

    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [price, setPrice] = useState(0);
    const [method, setMethod] = useState<ShippingOption['method'] | ''>('');

    const resetForm = () => {
        setMethod('');
        setPrice(0);
        setSelectedId(null);
        setEditMode(false);
    };


    // 🔹 Új szállítási mód mentése
    const handleSave = async () => {
        if (!method) {
            alert("Method is required!");
            return;
        }
    
        const shippingData: ShippingOptionInput = { method, price };
    
        if (editMode) {
            await updateShippingOption(selectedId!, shippingData); // ✅ UPDATE esetén id-t külön adjuk át
        } else {
            await createShippingOption(shippingData); // ✅ CREATE esetén nem szükséges id
        }
    
        resetForm();
        setModalOpen(false);
    };

    // 🔹 Szerkesztés beállítása
    const handleEdit = (id: number, method: ShippingOption['method'], price: number) => {
        setSelectedId(id);
        setMethod(method);
        setPrice(price);
        setEditMode(true);
        setModalOpen(true);
    };

    // 🔹 Törlés
    const handleDelete = async (id: number) => {
        if (confirm('Biztosan törölni szeretnéd ezt a szállítási módot?')) {
            await deleteShippingOption(id);
        }
    };

    return (
        <Container size="xl" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
            <AdminBar />
            <div style={{ padding: '20px' }}>
                {/* FEJLÉC */}
                <Group justify="space-between" mb="md">
                    <Text size="xl" fw={700}>
                        Szállítási díjak kezelése
                    </Text>
                    <Button
                        leftSection={<IconPlus size={18} />}
                        onClick={() => setModalOpen(true)}
                    >
                        Új szállítási díj
                    </Button>
                </Group>

                <Divider mb="md" />

                {/* HIBAÜZENET */}
                {error && (
                    <Text color="red" mb="md">
                        {error}
                    </Text>
                )}

                {/* TÁBLÁZAT */}
                <Table highlightOnHover style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '30%', textAlign: 'left' }}>Method</th>
                            <th style={{ width: '20%', textAlign: 'center' }}>Díj (Ft)</th>
                            <th style={{ width: '20%', textAlign: 'center' }}>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shippingOptions.map((option) => (
                            <tr key={option.id}>
                                <td style={{ width: '30%', textAlign: 'left' }}>
                                    {option.method === 'HOME_DELIVERY' && (
                                        <Badge style={{ width: '140px', textAlign: 'center' }} color="blue">
                                            HÁZHOZ SZÁLLÍTÁS
                                        </Badge>
                                    )}
                                    {option.method === 'FOXPOST' && (
                                        <Badge style={{ width: '140px', textAlign: 'center' }} color="yellow">
                                            FOXPOST
                                        </Badge>
                                    )}
                                    {option.method === 'PACKETA' && (
                                        <Badge style={{ width: '140px', textAlign: 'center' }} color="pink">
                                            PACKETA
                                        </Badge>
                                    )}
                                    {option.method === 'SHOP' && (
                                        <Badge style={{ width: '140px', textAlign: 'center' }} color="green">
                                            ÜZLETBEN ÁTVÉTEL
                                        </Badge>
                                    )}
                                </td>
                                <td style={{ width: '20%', textAlign: 'center' }}>
                                    {option.price.toLocaleString()} Ft
                                </td>
                                <td style={{ width: '20%', textAlign: 'center' }}>
                                    <Group gap="xs" justify="center">
                                        <ActionIcon
                                            color="blue"
                                            onClick={() =>
                                                handleEdit(option.id, option.method, option.price)
                                            }
                                        >
                                            <IconEdit size={18} />
                                        </ActionIcon>
                                        <ActionIcon
                                            color="red"
                                            onClick={() => handleDelete(option.id)}
                                        >
                                            <IconTrash size={18} />
                                        </ActionIcon>
                                    </Group>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* MODAL */}
                <Modal
                centered
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={editMode ? 'Szállítási díj módosítása' : 'Új szállítási díj hozzáadása'}
                >
                    <Select
                        label="Szállítási mód"
                        data={shippingMethods}
                        value={method}
                        onChange={(value) => setMethod(value as ShippingOption['method'])}
                        disabled={editMode}
                    />
                    <NumberInput
                        label="Díj (Ft)"
                        value={price}
                        onChange={(value) => setPrice(Number(value) || 0)}
                        mt="md"
                    />
                    <Group mt="md" justify="space-between">
                        <Button onClick={resetForm} variant="default">
                            Mégse
                        </Button>
                        <Button color="green" onClick={handleSave} loading={loading}>
                            {editMode ? 'Módosítás' : 'Mentés'}
                        </Button>
                    </Group>
                </Modal>
            </div>
        </Container>
    );
};

export default AdminShipping;
