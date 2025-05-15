import {
  Text, Container, Avatar, Loader, Alert, Grid, Card, Title, Group, Box,
  Button, ActionIcon, Progress, Tooltip, TextInput
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
import { useNotification } from "../context/NotificationContext";
import { useMediaQuery } from '@mantine/hooks';
import { useCoupon } from '../hooks/useCoupon';
import { getUserProfile } from '../services/UserService';

export default function UserProfile() {
  const { user, setUser, updateUser, loading: userLoading, error: userError } = useUser();
  const { orders, loading: orderLoading, error: orderError } = useOrder();
  const { favorites, loading: favoriteLoading, error: favoriteError } = useFavorite(user?.id || 0);
  const { reviews, loading: reviewLoading, error: reviewError } = useReviews(user?.id || 0);
  const { billings, isLoading: billingLoading } = useBilling();
  const { favoritePoint } = useFavoritePickup();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [modalOpen, setModalOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'pickupPoint' | 'deliveryAddress' | 'billingAddress' | 'profile'>('profile');
  const [data, setData] = useState({});
  const { showSuccess, showError } = useNotification();
  const { generateRewardCoupon, coupons } = useCoupon();
  const [defaultDeliveryAddress] = useState<string | null>("Nincs elmentett cím");
  const [localRewardPoints, setLocalRewardPoints] = useState(user?.rewardPoints ?? 0);

  interface GeneratedCoupon {
    code: string;
    validUntil?: string;
    user?: { id: number };
    discountPercentage?: number;
  }

  useEffect(() => {
    // ✅ Adatok betöltése a profilból
    if (user) {
    }
  }, [user]);

  useEffect(() => {
    if (user?.rewardPoints !== undefined) {
      setLocalRewardPoints(user.rewardPoints);
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

  const handleRewardCoupon = async (percent: number) => {
    try {
      const generated = await generateRewardCoupon(percent);
      if (generated && generated.code) {
        showSuccess(`${percent}% kupon sikeresen generálva! Kód: ${generated.code}`);

        // ✅ Teljes user újralekérdezés
        const res = await fetch('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Cache-Control': 'no-cache',
          },
          cache: 'no-store',
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Fetch error response text:", text);
          throw new Error('Felhasználói adatok frissítése sikertelen');
        }

        const updatedUser = await getUserProfile();
        setUser(updatedUser);
        setLocalRewardPoints(updatedUser.rewardPoints ?? 0);
      } else {
        showError("Nem sikerült létrehozni a kupont.");
      }
    } catch (err) {
      console.error("Kupon generálás utáni hiba:", err);
      showError("Hiba történt a kupon generálásakor.");
    }
  };

  const rewardPoints = localRewardPoints;
  const registrationYear = user.createdAt ? dayjs().year() - dayjs(user.createdAt).year() : "N/A";

  return (
    <Container size={isMobile ? "xs" : "md"} py={isMobile ? "md" : "xl"}>
      <UserBar />
      <Grid gutter="md">
        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group
              justify="space-between"
              style={{
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '16px' : '0',
              }}
            >
              <Group>
                <Box
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                  }}
                >
                  <Avatar src={user.avatar || "/default-avatar.png"} size={isMobile ? 70 : 100} radius="xl" />

                  <ActionIcon
                    size="sm"
                    color="green"
                    variant="filled"
                    style={{
                      position: 'absolute',
                      top: isMobile ? 50 : 80,
                      right: isMobile ? 20 : 50,
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
                  <Text color="dimmed" size={isMobile ? "xs" : "sm"}>Email: {user.email}</Text>
                  <Text color="dimmed" size={isMobile ? "xs" : "sm"}>Telefonszám: {user.phone || "Nincs megadva"}</Text>
                  <Text color="dimmed" size={isMobile ? "xs" : "sm"}>Meghívó linked: {`https://jsglobal.hu/register?ref=${user.referralCode}`}</Text>
                  <Button color="green" size="xs" onClick={() => handleOpenModal('profile', user)} style={{ marginTop: "5px" }}>Profile szerkesztése</Button>
                </div>
              </Group>

              {/* 🔹 Regisztrációs év jobb oldalra helyezése */}
              <Card shadow="sm" padding="xs" radius="md" style={{ width: isMobile ? "100%" : "150px", height: isMobile ? "auto" : "100px" }} withBorder>
                <Text fw={300}>Köszönjük, hogy ügyfelünk vagy!</Text>
                <Text color="dimmed">{registrationYear} éve</Text>
              </Card>
            </Group>
          </Card>
        </Grid.Col>


        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg" radius="md" withBorder style={{
            paddingBottom: coupons?.filter((c: any) => c.user?.id === user.id).length > 0 ? "lg" : "60px",
          }}>
            <Title order={3} ta="center" mb="sm">
              Hűségpontjaid
            </Title>
            <Text ta="center" mb="40px">
              🎯 Jelenlegi egyenleged: <strong>{localRewardPoints}</strong> pont ({localRewardPoints} Ft érték)
            </Text>
            <Box style={{ position: 'relative' }}>
              <Progress value={(localRewardPoints / 10000) * 100} color="green" size="lg" radius="xl" />

              {/* 🎯 Milestone 2000 pont – 10% */}
              <Tooltip label="Váltsd be 2000 pontért egy 10%-os kuponra!" withArrow color="green" position="top">
                <Box
                  style={{
                    position: 'absolute',
                    left: '20%',
                    top: '-35px',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    zIndex: 10,
                    cursor: localRewardPoints >= 2000 ? 'pointer' : 'default',
                  }}
                  onClick={() => localRewardPoints >= 2000 && handleRewardCoupon(10)}
                >
                  <Box
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '13px',
                      background: localRewardPoints >= 2000 ? 'linear-gradient(135deg, #38d9a9, #12b886)' : '#dee2e6',
                      color: localRewardPoints >= 2000 ? '#fff' : '#868e96',
                      boxShadow: localRewardPoints >= 2000 ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    🎁 10%
                  </Box>
                  <Text size="xs" color={localRewardPoints >= 2000 ? 'green' : 'gray'} mt={22}>
                    2000 pont
                  </Text>
                </Box>
              </Tooltip>
              {/* 🎯 Milestone 4000 pont – 20% */}
              <Tooltip label="Váltsd be 4000 pontért egy 20%-os kuponra!" withArrow color="violet" position="top">
                <Box
                  style={{
                    position: 'absolute',
                    left: '40%',
                    top: '-35px',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    zIndex: 10,
                    cursor: localRewardPoints >= 4000 ? 'pointer' : 'default',
                  }}
                  onClick={() => localRewardPoints >= 4000 && handleRewardCoupon(20)}
                >
                  <Box
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '13px',
                      background: localRewardPoints >= 4000 ? 'linear-gradient(135deg, #845ef7, #5f3dc4)' : '#dee2e6',
                      color: localRewardPoints >= 4000 ? '#fff' : '#868e96',
                      boxShadow: localRewardPoints >= 4000 ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    💎 20%
                  </Box>
                  <Text size="xs" color={localRewardPoints >= 4000 ? 'green' : 'gray'} mt={22}>
                    4000 pont
                  </Text>
                </Box>
              </Tooltip>
            </Box>
            {coupons && coupons.filter((c: any) => c.user?.id === user.id).length > 0 && (
              <Box mt="lg">
                <Title order={5}>🎫 Hűségpont kuponjaid:</Title>
                {coupons
                  .filter((c: any) => c.user?.id === user.id)
                  .map((coupon) => (
                    <Text key={coupon.code} ta="center">
                      Kód: <strong>{coupon.code}</strong> – {coupon.discountPercentage}% kedvezmény - Érvényes: {dayjs(coupon.validUntil).format("YYYY. MM. DD")}
                    </Text>
                  ))}
              </Box>
            )}
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
              <Text onClick={() => handleOpenModal('deliveryAddress')} color="green" size="sm" style={{ marginTop: "auto", cursor: "pointer" }}>
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
              <Text onClick={() => handleOpenModal('billingAddress')} color="green" size="sm" style={{ marginTop: "auto", cursor: "pointer" }}>
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
        onSave={async (newData) => {
          showSuccess('Adatok sikeresen elmentve!')
          console.log('Mentett adatok:', newData);
          await updateUser(newData);
          setModalOpen(false);
        }}
      />
    </Container>
  );
}
