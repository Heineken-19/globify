import { useState } from 'react';
import { Modal, Text, Button, ScrollArea, Textarea, Group, Rating, Divider } from '@mantine/core';
import { useReviews } from '../hooks/useReview';
import { useNotification } from '../context/NotificationContext';

interface Props {
  productId: number;
  onClose: () => void;
}

const ReviewModal = ({ productId, onClose }: Props) => {
  const { reviews, averageRating, addReview } = useReviews(productId);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { showSuccess, showError } = useNotification();

  const handleAddReview = async () => {
    if (!rating || !comment.trim()) return;
    const userId = Number(localStorage.getItem('user_id'));
    setIsSubmitting(true);

    try {
      await addReview(userId, rating, comment);
      setComment('');
      setRating(undefined);
      showSuccess('Köszönjük, hogy megosztottad a véleményedet :)');
    } catch (error) {
      console.error('Hiba a vélemény hozzáadásakor:', error);
      showError('Nem sikerült elküldeni a véleményed :(');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title="Vélemények"
      size="md"
      centered
      overlayProps={{
        backgroundOpacity: 0.5,
        blur: 3,
      }}
      styles={{
        body: {
          padding: 0,
        },
        header: {
          fontSize: '18px',
          fontWeight: 600,
          padding: '12px 16px',
          borderBottom: '1px solid #ddd',
        },
      }}
    >
      {/* Átlagos értékelés */}
      <div style={{ padding: '12px 16px', backgroundColor: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
        <Text size="lg" fw={500}>
          Átlagos értékelés: {averageRating ? `${averageRating.toFixed(1)} ⭐` : 'Nincs értékelés'}
        </Text>
      </div>

      {/* Görgethető vélemények listája */}
      <ScrollArea style={{ height: 300, padding: '12px 16px' }}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <Text fw={500} size="sm">
                {review.comment}
              </Text>
              <Rating value={review.rating} readOnly size="sm" />
              <Text size="xs" color="gray" mt={4}>
                {new Date(review.createdAt).toLocaleDateString('hu-HU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </div>
          ))
        ) : (
          <Text color="gray" size="sm">
            Nincs még vélemény.
          </Text>
        )}
      </ScrollArea>

      <Divider my="sm" />

      {/* Vélemény hozzáadás */}
      <div style={{ padding: '5px 16px' }}>
        <Text size="sm" fw={500} style={{ marginBottom: '3px' }}>
          Kérjük mondja el a véleményét a termékről
        </Text>
        <Rating
          value={rating}
          onChange={setRating}
          size="md"
          style={{ marginBottom: '8px' }}
        />
        <Textarea
          placeholder="Írd le a véleményed..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          minRows={2}
          maxRows={5}
          autosize
          styles={{ input: { borderColor: '#ddd' } }}
        />
        <Group mt="md" justify="apart">
          <Button
            color="green"
            onClick={handleAddReview}
            loading={isSubmitting}
            disabled={!rating || !comment.trim()}
          >
            Küldés
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

export default ReviewModal;
