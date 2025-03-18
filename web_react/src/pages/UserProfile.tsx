import {
  Text, Container, Avatar, Loader, Alert, Grid, Card, Title, Group, Box,
  Button, ActionIcon
} from "@mantine/core";
import { IconStar, IconHeart, IconShoppingBag, IconHome, IconReceipt, IconPackage, IconPencil } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useUser } from "../hooks/useUser";
import { useFavorite } from "../hooks/useFavorite";
import { useReviews } from '../hooks/useReview';
import { useBilling } from "../hooks/useBilling";
import { useFavoritePickup } from "../hooks/useFavoritePickup";
import UserProfileModal from '../modal/UserProfileModal';
import AvatarSelectorModal from '../modal/AvatarSelectorModal';
import useOrder from "../hooks/useOrder";
import UserBar from "../components/UserBar";
import dayjs from "dayjs";

export default function UserProfile() {
  const { user, updateUser, loading: userLoading, error: userError } = useUser();
  const { fetchUserOrders, orders, loading: orderLoading, error: orderError } = useOrder();
  const { favorites, fetchFavorites, loading: favoriteLoading, error: favoriteError } = useFavorite(user?.id || 0);
  const { reviews, fetchReviews, loading: reviewLoading, error: reviewError } = useReviews(user?.id || 0);
  const { billings, isLoading: billingLoading } = useBilling();
  const { favoritePoint } = useFavoritePickup();
  const [modalOpen, setModalOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'pickupPoint' | 'deliveryAddress' | 'billingAddress' | 'profile'>('profile');
  const [data, setData] = useState({});

  const [, setSelectedShippingPoint] = useState<string | null>(null);
  const [defaultDeliveryAddress, setDefaultDeliveryAddress] = useState<string | null>("Nincs elmentett cím");

  useEffect(() => {
    // ✅ Adatok betöltése a profilból
    if (user) {
      console.log("Profiladatok betöltve:", user);
    }
  }, [user]);

  if (!user) return <Alert color="yellow">Nincs elérhető felhasználói adat.</Alert>;
  if (userLoading || orderLoading || favoriteLoading || reviewLoading || billingLoading) return <Loader />;
  if (userError) return <Alert color="red">{userError}</Alert>;
  if (orderError) return <Alert color="red">{orderError}</Alert>;
  if (favoriteError) return <Alert color="red">{favoriteError}</Alert>;
  if (reviewError) return <Alert color="red">{reviewError}</Alert>;

  const handleOpenModal = (type: typeof modalType, initialData = {}) => {
    setModalType(type);
    setData(initialData);
    setModalOpen(true);
  };

  const handleAvatarChange = async (newAvatar: string) => {
    if (user) {
      try {
        await updateUser({ ...user, avatar: newAvatar }); // ✅ Backend frissítés
        console.log('✅ Avatar frissítve:', newAvatar);
      } catch (error) {
        console.error('❌ Avatar frissítése sikertelen:', error);
      }
    }
  };

  // 🔹 Kiszámoljuk hány éve regisztrált az ügyfél
  const registrationYear = user.createdAt ? dayjs().year() - dayjs(user.createdAt).year() : "N/A";

  return (
    <Container size="md" py="xl">
      <UserBar />
      <Grid gutter="md">
        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between"> {/* Két oldalra igazítja a tartalmat */}
              <Group>
              <Box
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                  }}
                >
                <Avatar src={user.avatar || "/default-avatar.png"} size={100} radius="xl" />

                <ActionIcon
                    size="sm"
                    color="green"
                    variant="filled"
                    style={{
                      position: 'absolute',
                      top: 80,
                      right: 50,
                      transform: 'translate(50%, 50%)',
                      borderRadius: '50%',
                      zIndex: 5,
                    }}
                    onClick={() => setAvatarModalOpen(true)}
                  >
                    <IconPencil size={18} />
                  </ActionIcon>
                  </Box>
                <div>
                  <Title order={3} mt="sm">
                    {user.firstName} {user.lastName}
                  </Title>
                  <Text color="dimmed" size="sm">
                    {user.nickname ? `Becenév: ${user.nickname}` : "Nincs megadva becenév"}
                  </Text>
                  <Text color="dimmed" size="sm">Email: {user.email}</Text>
                  <Text color="dimmed" size="sm">Telefonszám: {user.phone || "Nincs megadva"}</Text>
                  <Button color="green" size="xs" onClick={() => handleOpenModal('profile', user)} style={{marginTop:"5px"}}>Profile szerkesztése</Button>
                </div>
              </Group>

              {/* 🔹 Regisztrációs év jobb oldalra helyezése */}
              <Card shadow="sm" padding="xs" radius="md" style={{ width: "150px", height: "100px" }} withBorder>
                <Text fw={300}>Köszönjük, hogy ügyfelünk vagy!</Text>
                <Text color="dimmed">{registrationYear} éve</Text>
              </Card>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} ta="center" mb="md">
              Tevékenységeid
            </Title>

            <Group style={{ justifyContent: "space-between" }}>
              {/* 🔹 Rendelések */}
              <Group>
                <IconShoppingBag size={32} color="#F5A623" />
                <div>
                  <Text fw={500}>{orders.length} regisztrált rendelés</Text>
                  <Text color="dimmed">{orders.filter(order => order.status !== "COMPLETED").length} aktív rendelés</Text>
                  <Text component={Link} to="/profile/orders" color="green" size="sm">
                    Rendelési előzményeid
                  </Text>
                </div>
              </Group>

              {/* 🔹 Elválasztó vonal */}
              <div style={{ width: "1px", backgroundColor: "#ddd", height: "50px" }}></div>

              {/* 🔹 Kedvencek */}
              <Group>
                <IconHeart size={32} color="#F44336" />
                <div>
                  <Text fw={500}>{favorites.length} kedvenc termék</Text>
                  <Text component={Link} to="/profile/favorites" color="green" size="sm">
                    Kedvenc termékeid
                  </Text>
                </div>
              </Group>

              {/* 🔹 Elválasztó vonal */}
              <div style={{ width: "1px", backgroundColor: "#ddd", height: "50px" }}></div>

              {/* 🔹 Értékelések */}
              <Group>
                <IconStar size={32} color="#FFC107" />
                <div>
                  <Text fw={500}>{reviews.length} értékelés hozzáadva</Text>
                  <Text color="dimmed">0 hozzászólás</Text>
                  <Text component={Link} to="/profile/reviews" color="green" size="sm">
                    Hozzászólásaid
                  </Text>
                </div>
              </Group>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
        <Group justify="center" style={{ gap: "10px" }}> 
            {/* Kedvenc átvételi pont */}
            <Card shadow="md" padding="lg" radius="md" withBorder style={{ width: "300px", height: "350px" }}>
              <Group justify="space-between">
                <Text fw={500}>Kedvenc átvételi pont</Text>
                <IconPackage size={24} color="green" />
              </Group>
              
              {favoritePoint ? (
                <Box p={10}>
                  <Text fw={600}>{favoritePoint.name}</Text>
                  <Text size="sm" color="dimmed">{favoritePoint.city}, {favoritePoint.zip}</Text>
                  <Text size="sm" color="dimmed">{favoritePoint.address}</Text>
                </Box>
              ) : (
                <Text p={10} color="dimmed">"Nincs elmentett cím"</Text>
              )}

              <Text onClick={() => handleOpenModal('pickupPoint')} color="green" size="sm" style={{ marginTop: "auto", cursor: "pointer" }}>
                Változtasd meg a kedvenc átvételi pontod
              </Text>
            </Card>

            {/* Kézbesítési címem */}
            <Card shadow="md" padding="lg" radius="md" withBorder style={{ width: "300px", height: "350px" }}>
              <Group justify="space-between">
                <Text fw={500}>Kézbesítési címem</Text>
                <IconHome size={24} color="green" />
              </Group>
              <Text color="dimmed" p={10}>{defaultDeliveryAddress}</Text>
              <Text onClick={() => handleOpenModal('deliveryAddress')} color="green" size="sm" style={{ marginTop: "auto", cursor:"pointer" }}>
                Kézbesítési címek módosítása
              </Text>
            </Card>

            {/* Számlázási címek */}
            <Card shadow="md" padding="lg" radius="md" withBorder style={{ width: "300px", height: "350px" }}>
              <Group justify="space-between">
                <Text fw={500}>Számlázási címek</Text>
                <IconReceipt size={24} color="green" />
              </Group>
              {billings?.data && billings.data.length > 0 ? (
                <Box p={10}>
                  <Text fw={600}>{billings.data[0]?.companyName}</Text>
                  <Text size="sm" color="dimmed">{billings.data[0]?.taxNumber}</Text>
                  <Text size="sm">{billings.data[0]?.street}</Text>
                  <Text size="sm">{billings.data[0]?.postalCode}, {billings.data[0]?.city}</Text>
                  <Text size="md">{billings.data[0]?.country}</Text>
                </Box>
              ) : (
                <Text color="dimmed">Nincs elmentett cím</Text>
              )}
              <Text onClick={() => handleOpenModal('billingAddress')} color="green" size="sm" style={{ marginTop: "auto", cursor:"pointer" }}>
                Számlázási cím hozzáadása
              </Text>
            </Card>
          </Group>
        </Grid.Col>
      </Grid>

      <AvatarSelectorModal
        opened={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        onSelect={handleAvatarChange}
      />

      <UserProfileModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        data={data}
        onSave={(newData) => {
          console.log('Mentett adatok:', newData);
          setModalOpen(false);
        }}
      />
    </Container>
  );
}
