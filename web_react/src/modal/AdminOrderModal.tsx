import { Modal, Accordion, Text } from '@mantine/core';
import { Order } from '../types';
import { translateOrderShipping } from '../utils/translate';
import { useModal } from "../context/ModalContext";
import { useEffect } from 'react';

interface AdminOrderMoralProps {
  order: Order;
  opened: boolean;
  onClose: () => void;
}

const AdminOrderModal = ({ order, opened, onClose }: AdminOrderMoralProps) => {
  const { setModalOpen } = useModal();

  useEffect(() => {
    setModalOpen(opened); // amikor nyitva van, állítsd be
  }, [opened]);

  return (
    <Modal opened={opened} onClose={onClose} title={`Rendelés részletezés - Azonosító: ${order.id}`} size="lg" centered>
      <Accordion>
        {/* Termékek */}
        <Accordion.Item value="products">
          <Accordion.Control>Termékek</Accordion.Control>
          <Accordion.Panel>
          {order?.orderItems && order.orderItems.length > 0 ? (
              order.orderItems.map((item) => (
              <Text key={item.productId}>
                {item.productName} - {item.quantity} db    {item.price.toLocaleString('hu-HU')} Ft
                </Text>
            ))
          ) : (
            <Text>Nincsenek termékek a rendelésben.</Text>
          )}
          </Accordion.Panel>
        </Accordion.Item>

        {/* Számlázási adatok */}
        <Accordion.Item value="billing">
          <Accordion.Control>Billing Info</Accordion.Control>
          <Accordion.Panel>
            <Text> {order.billingInfo.companyName || 'N/A'}</Text>
            <Text> {order.billingInfo.taxNumber || 'N/A'}</Text>
            <Text> {order.billingInfo.street}, {order.billingInfo.city}</Text>
            <Text> {order.billingInfo.postalCode} {order.billingInfo.city}</Text>
            <Text> {order.billingInfo.country}</Text>
          </Accordion.Panel>
        </Accordion.Item>

        {/* Szállítási adatok */}
        <Accordion.Item value="shipping">
          <Accordion.Control>Shipping Info</Accordion.Control>
          <Accordion.Panel>
            <Text>Szállítási cím: {order.shippingInfo.address || order.shippingInfo.shippingPoint}</Text>
            <Text>Szállítási mód: {translateOrderShipping(order.shippingInfo.shippingMethod)}</Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Modal>
  );
};

export default AdminOrderModal;