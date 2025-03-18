import React, { useState, useEffect } from 'react';
import { Table, Avatar, Text, Button, NumberInput, ActionIcon, Paper, Group, Divider, TextInput } from '@mantine/core';
import { IconTrash, IconCheck, IconX } from '@tabler/icons-react';
import { API_URL } from '../../config/config';


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
    setDiscount,
    onNext
}) => {
    const [isEmpty, setIsEmpty] = useState<boolean>(cart.length === 0);
    

    useEffect(() => {
        setIsEmpty(cart.length === 0);
    }, [cart]);


    return (


        <div style={{ display: "flex", justifyContent: "center", gap: "40px", padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <Paper shadow="sm" p="lg" style={{ flex: 3 }}>
                {isEmpty ? (
                    <Text
                        size="lg"
                        fw={500}
                        style={{
                            textAlign: "center",
                            marginTop: "20px",
                            color: "#888",
                        }}
                    >
                        A kosár üres, vissza navigálunk a termékek oldalra...
                    </Text>
                ) : (
                    <>
                        <Table>
                            <tbody>
                                {cart.map((item, index) => {
                                    return (
                                        <React.Fragment key={item.id || index}>
                                            <tr key={item.id || index}>
                                                <td style={{ width: "80px" }}>
                                                    <Avatar src={item.imageUrls?.[0] ? `${API_URL}/uploads/${item.imageUrls[0]}` : `${API_URL}/uploads/default.jpg`} />
                                                </td>
                                                <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                                                    {item.name}
                                                </td>
                                                <td>
                                                    <Text>Mennyiség:</Text>
                                                    <NumberInput
                                                        value={item.quantity}
                                                        min={1}
                                                        onChange={(value) => updateQuantity(item.id, Number(value) || 1)}
                                                        size="xs"
                                                        style={{ width: 60, textAlign: "center" }}
                                                    />
                                                </td>
                                                <td>{item.quantity > 1 ? `${item.price} Ft/db` : ""}</td>
                                                <td>{item.price * item.quantity} Ft</td>
                                                <td>
                                                    <ActionIcon color="red" onClick={() => removeFromCart(item.id)}>
                                                        <IconTrash size={16} />
                                                    </ActionIcon>
                                                </td>
                                            </tr>
                                            {index < cart.length - 1 && (
                                                <tr>
                                                    <td colSpan={6}><Divider my="sm" /></td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </>
                )}
            </Paper>



            <Paper shadow="sm" p="lg" style={{ flex: 1 }}>
                <Text size="lg" fw={500}>Rendelés összegzés</Text>
                <Divider my="sm" />
                <Group justify="apart">
                    <Text>Részösszeg:</Text>
                    <Text>{subtotal.toLocaleString()} Ft</Text>

                    {discount > 0 && (
                        <>
                            <Text color="orange">Kedvezmény:</Text>
                            <Text color="orange">
                                - {discount.toLocaleString()} Ft
                            </Text>
                        </>
                    )}
                </Group>
                <Divider my="sm" />
                <Group justify="apart">
                    <Text fw={700}>Végösszeg:</Text>
                    <Text fw={700}>
                        {(subtotal - discount).toLocaleString()} Ft
                    </Text>

                </Group>
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
                <Button fullWidth mt="md" color="green" onClick={onNext} >Tovább</Button>
            </Paper>
        </div>


    );
};

export default CartSummary;
