import {
  Box,
  Button,
  Group,
  Stack,
  Text,
  Title,
  Paper,
  Divider,
  ScrollArea,
  ActionIcon,
  Tooltip,
  Container,
  Tabs,
} from "@mantine/core";
import {
  useNewsletterTemplates,
  useDeleteNewsletterTemplate,
  useSendNewsletterTemplate,
} from "../..//hooks/admin/useAdminNewsletter";
import { useState } from "react";
import AdminNewsletterModal from "../../modal/admin/AdminNewsletterModal";
import { IconTrash, IconSend, IconEdit } from "@tabler/icons-react";
import { NewsletterTemplate } from "../../services/admin/AdminNewsletterService";
import AdminBar from "./AdminBar";
import AdminSubscribers from "./AdminSubscribers";

const AdminNewsPage = () => {
  const { data: templates, isLoading } = useNewsletterTemplates();
  const deleteMutation = useDeleteNewsletterTemplate();
  const sendMutation = useSendNewsletterTemplate();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NewsletterTemplate | null>(null);

  const handleEdit = (template: NewsletterTemplate) => {
    setSelectedTemplate(template);
    setModalOpen(true);
  };

  const handleNew = () => {
    setSelectedTemplate(null);
    setModalOpen(true);
  };

  return (
    <Container size="xl" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
      <AdminBar />

      <Box p="md">
        <Tabs defaultValue="templates">
          <Tabs.List>
            <Tabs.Tab value="templates">📰 Hírlevél sablonok</Tabs.Tab>
            <Tabs.Tab value="subscribers">📬 Feliratkozók</Tabs.Tab>
          </Tabs.List>

          <Divider mb="md" />

          <Tabs.Panel value="templates" pt="md">
            <Group justify="flex-end" mb="md">
              <Button color="green" onClick={handleNew}>
                Új sablon létrehozása
              </Button>
            </Group>
            <ScrollArea>
              <Stack>
                {isLoading ? (
                  <Text>Betöltés...</Text>
                ) : templates && templates.length > 0 ? (
                  templates.map((template) => (
                    <Paper key={template.id} shadow="xs" p="md" radius="md" withBorder>
                      <Group justify="space-between">
                        <Box>
                          <Text fw={500}>{template.subject}</Text>
                          <Text size="sm" c="dimmed" mt={4}>
                            {template.message.slice(0, 100)}...
                          </Text>
                          <Text size="xs" c="gray" mt={6}>
                            Létrehozva: {new Date(template.createdAt).toLocaleString("hu-HU")}
                          </Text>
                        </Box>

                        <Group>
                          <Tooltip label="Kiküldés">
                            <ActionIcon
                              onClick={() => sendMutation.mutate(template.id)}
                              loading={sendMutation.isPending}
                              variant="light"
                              color="green"
                            >
                              <IconSend size={18} />
                            </ActionIcon>
                          </Tooltip>

                          <Tooltip label="Szerkesztés">
                            <ActionIcon
                              onClick={() => handleEdit(template)}
                              variant="light"
                              color="blue"
                            >
                              <IconEdit size={18} />
                            </ActionIcon>
                          </Tooltip>

                          <Tooltip label="Törlés">
                            <ActionIcon
                              onClick={() => deleteMutation.mutate(template.id)}
                              loading={deleteMutation.isPending}
                              variant="light"
                              color="red"
                            >
                              <IconTrash size={18} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Group>
                    </Paper>
                  ))
                ) : (
                  <Text>Nincs még létrehozott sablon.</Text>
                )}
              </Stack>
            </ScrollArea>
          </Tabs.Panel>
          <Tabs.Panel value="subscribers" pt="md">
            <AdminSubscribers />
          </Tabs.Panel>
        </Tabs>

        <AdminNewsletterModal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          template={selectedTemplate}
        />
      </Box>
    </Container>
  );
};

export default AdminNewsPage;