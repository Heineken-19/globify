import { useEffect, useState } from "react";
import { Modal, Avatar, Text, Button, Group, Table, Loader, Alert } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import useOrder from "../hooks/useOrder";
import { OrderModalProps } from "../types";
import { API_URL } from '../config/config';


export default function OrderModal({ orderId, opened, onClose }: OrderModalProps) {
  const navigate = useNavigate();
  const { getOrderById } = useOrder();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId && opened) {
      setLoading(true);
      getOrderById(orderId)
        .then((data) => {
          if (data) {
            setOrder(data);
          } else {
            setError("Nem sikerült lekérni a rendelés adatait.");
          }
        })
        .catch(() => setError("Hiba történt a rendelés lekérése közben."))
        .finally(() => setLoading(false));
    }
  }, [orderId, opened]);

  // 🔥 Ellenőrizzük, hogy az order már létezik
  if (!order) return null;

  if (loading) return <Loader />;
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <Modal opened={opened} onClose={onClose} size="1000" centered>
      <Text size="xl" fw={700} mb="md">
        Rendelés részletei #{order?.id}
      </Text>

      {/* Termékek listázása */}
      <Table striped
        highlightOnHover
        style={{
          tableLayout: "fixed", // Fix méretű oszlopok
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ width: "10%" }}></th>
            <th style={{ width: "15%" }}></th>
            <th style={{ width: "20%" }}></th>
            <th style={{ width: "15%" }}></th>
            <th style={{ width: "5%" }}></th>
            <th style={{ width: "10%" }}></th>
            <th style={{ width: "15%" }}></th>
          </tr>
        </thead>
        <tbody>
          {order?.items?.map((item: any) => {
            const imageUrl =
            item.product.imageUrls && item.product.imageUrls.length > 0
              ? `${API_URL}/uploads/${item.product.imageUrls[0]}`
              : `${API_URL}/uploads/default.jpg`;

            return (
              <tr key={item.id}>
                <td>
                  <Avatar src={imageUrl} style={{ width: 50, height: 50 }} />
                </td>
                <td>{item.product.name}</td>
                <td>Termék mérete: {item.size || "N/A"} cm</td>
                <td>
                  {item.type
                    ? (item.type.split(",") as string[]).map((part: string, index: number) => (
                      <span key={index}>
                        {part.trim()}
                        {index < item.type.split(",").length - 1 && <br />} {/* Sortörés */}
                      </span>
                    ))
                    : "N/A"}
                </td>
                <td>{item.quantity} db</td>
                <td>
                  {new Intl.NumberFormat("hu-HU", {
                    useGrouping: true,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                    .format(item.price ?? 0)
                    .replace(/\s/g, ".")} Ft
                </td>
                <td>
                  <Button
                    size="xs"
                    color="blue"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    Termék megtekintése
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Összegzés */}
      <Group justify="space-between" mt="md">
        <Text size="lg" fw={700}>
          Végösszeg:{" "}
          <b>
            {new Intl.NumberFormat("hu-HU", {
              useGrouping: true,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
              .format(order?.finalPrice ?? 0)
              .replace(/\s/g, ".")} Ft
          </b>
        </Text>
      </Group>
    </Modal>
  );
}
