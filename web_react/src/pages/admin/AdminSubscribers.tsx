import { Table, Text, ActionIcon, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useNewsletterSubscribers } from "../../hooks/admin/useNewsletterSubscribers";
import { useUnsubscribeFromNewsletter } from "../../hooks/useNewsLetter";

const AdminSubscribers = () => {
  const { data, isLoading, refetch } = useNewsletterSubscribers();
  const unsubscribeMutation = useUnsubscribeFromNewsletter();

  const handleUnsubscribe = (email: string) => {
    unsubscribeMutation.mutate(email, {
      onSuccess: () => {
        refetch(); // frissítjük a listát
      }
    });
  };

  if (isLoading) return <Text>Betöltés...</Text>;

  return (
    <Table striped withTableBorder highlightOnHover>
      <thead>
        <tr>
          <th style={{ width: "5%", textAlign: "center" }}>ID</th>
          <th style={{ width: "36%", textAlign: "center" }}>Email</th>
          <th style={{ width: "30%", textAlign: "center" }}>Token</th>
          <th style={{ width: "10%", textAlign: "center" }}>Feliratkozva</th>
          <th style={{ width: "10%", textAlign: "center" }}>Törlés</th>
          
        </tr>
      </thead>
      <tbody>
        {data?.map((subscriber) => (
          <tr key={subscriber.id}>
            <td style={{ textAlign: "center" }}>{subscriber.id}</td>
            <td style={{ textAlign: "center" }}>{subscriber.email}</td>
            <td style={{ textAlign: "center" }}>{subscriber.unsubscribeToken || "-"}</td>
            <td style={{ textAlign: "center" }}>{subscriber.subscribed ? "✅" : "❌"}</td>
            <td style={{ textAlign: "center" }}>
              <Tooltip label="Leiratkoztatás">
                <ActionIcon
                  color="red"
                  variant="light"
                  onClick={() => handleUnsubscribe(subscriber.email)}
                  disabled={unsubscribeMutation.isPending}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </Tooltip>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AdminSubscribers;
