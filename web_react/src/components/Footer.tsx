import { Box, Container, Text, Group, rem, Anchor, Divider, SimpleGrid, Button, Input } from '@mantine/core';
import { IconBrandFacebook, IconBrandInstagram, IconBrandTwitter } from '@tabler/icons-react';
import { useState } from "react";
import { useSubscribeToNewsletter } from "../hooks/useNewsLetter";
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState("");
  const subscribeMutation = useSubscribeToNewsletter();
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      style={{
        backgroundColor: '#f8f8f8',
        padding: `${rem(40)} 0`,
        borderTop: '1px solid #e0e0e0',
        marginTop: 'auto',
      }}
    >
      <Container size="xl">
        {/* Felső rész */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
          {/* Céginformációk */}
          <Box>
            <Text fw={700} size="md" mb="sm">
              Globify
            </Text>
            <Text size="sm" color="dimmed">
              1234 Budapest, Példa utca 5.<br />
              Telefon: +36 1 234 5678<br />
              Email: info@globify.com
            </Text>
          </Box>

          {/* Termékkategóriák */}
          
          <Box>
            <Text fw={700} size="md" mb="sm">
              Termékeink
            </Text>
            <Group gap="md">
            <Anchor onClick={() => navigate('/products?category=new')} size="sm" color="dimmed">
              Újdonságaink
            </Anchor>
            <Anchor onClick={() => navigate('/products?category=sale')} size="sm" color="dimmed">
              Akciók
            </Anchor>
            <Anchor onClick={() => navigate('/products?category=Népszerű%20termékek')} size="sm" color="dimmed">
              Népszerű termékek
            </Anchor>
            </Group>
          </Box>

          {/* Ügyfélszolgálat */}
          <Box>
            <Text fw={700} size="md" mb="sm">
              Ügyfélszolgálat
            </Text>
            <Group gap="md">
            <Anchor onClick={() => navigate('/support/contact')} size="sm" color="dimmed">
              Kapcsolat
            </Anchor>
            <Anchor onClick={() => navigate('/support/faq')} size="sm" color="dimmed">
              GYIK
            </Anchor>
            <Anchor onClick={() => navigate('/support/return-policy')} size="sm" color="dimmed">
              Visszaküldési feltételek
            </Anchor>
            </Group>
          </Box>

          {/* Hírlevél feliratkozás */}
          <Box>
            <Text fw={700} size="md" mb="sm">
              Iratkozz fel hírlevelünkre
            </Text>
            <Group>
              <Input placeholder="Email cím" type="email" size="sm"  value={email}  onChange={(e) => setEmail(e.currentTarget.value)}  style={{ flexGrow: 1 }}  />
              <Button size="sm" color="green" onClick={() => {if (email) subscribeMutation.mutate(email);}}>
                Feliratkozás
              </Button>
            </Group>
          </Box>
        </SimpleGrid>

        {/* Elválasztó vonal */}
        <Divider my="lg" />

        {/* Alsó rész */}
        <Group justify="apart" mt="sm">
          {/* Jogi információk */}
          <Group>
            <Anchor href="/privacy-policy" size="xs" color="dimmed">
              Adatvédelmi irányelvek
            </Anchor>
            <Anchor href="/terms-of-service" size="xs" color="dimmed">
              ÁSZF
            </Anchor>
            <Anchor href="/impressum" size="xs" color="dimmed">
              Impresszum
            </Anchor>
          </Group>

          {/* Közösségi média ikonok */}
          <Group>
            <Anchor href="https://facebook.com" target="_blank">
              <IconBrandFacebook size={20} />
            </Anchor>
            <Anchor href="https://instagram.com" target="_blank">
              <IconBrandInstagram size={20} />
            </Anchor>
            <Anchor href="https://twitter.com" target="_blank">
              <IconBrandTwitter size={20} />
            </Anchor>
          </Group>

          {/* Szerzői jogi információ */}
          <Text size="xs" color="dimmed">
            © {new Date().getFullYear()} Globify. Minden jog fenntartva.
          </Text>
        </Group>
      </Container>
    </Box>
  );
};

export default Footer;
