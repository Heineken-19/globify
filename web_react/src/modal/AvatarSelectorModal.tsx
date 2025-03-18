import { Modal, Grid, Image, Box } from '@mantine/core';
import { useState } from 'react';

const avatars = [
  '/images/avatars/1.png',
  '/images/avatars/2.png',
  '/images/avatars/3.png',
  '/images/avatars/4.png',
  '/images/avatars/5.png',
  '/images/avatars/6.png',
];

interface AvatarSelectorModalProps {
  opened: boolean;
  onClose: () => void;
  onSelect: (avatar: string) => void;
}

const AvatarSelectorModal = ({ opened, onClose, onSelect }: AvatarSelectorModalProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const handleSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    onSelect(avatar); // ✅ Átadjuk a kiválasztott avatart a szülő komponensnek
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Válassz profilképet" centered>
      <Grid gutter="sm">
        {avatars.map((avatar) => (
          <Grid.Col key={avatar} span={3}>
            <Box
              style={{
                cursor: 'pointer',
                border: selectedAvatar === avatar ? '3px solid green' : '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'border 0.2s ease',
              }}
              onClick={() => handleSelect(avatar)}
            >
              <Image src={avatar} alt="avatar" />
            </Box>
          </Grid.Col>
        ))}
      </Grid>
    </Modal>
  );
};

export default AvatarSelectorModal;
