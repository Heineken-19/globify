import { useEffect, useState } from 'react';
import { Container, Text, Card, Image, Group, Rating, Divider } from '@mantine/core';
import { ReviewService } from '../services/ReviewService';
import { Review } from '../hooks/useReview';
import UserBar from '../components/UserBar';

const ReviewPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const userId = Number(localStorage.getItem('user_id'));

  useEffect(() => {
    if (userId) {
      fetchUserReviews();
    }
  }, [userId]);

  const fetchUserReviews = async () => {
    try {
      const allReviews = await ReviewService.getReviewsByProduct(userId);
      setReviews(allReviews);
    } catch (error) {
      console.error('Hiba a felhasználó véleményeinek lekérdezésénél:', error);
    }
  };

  return (
    <Container size="md" py="xl">
      <UserBar />
      <Text size="xl" fw={600} mb="lg">
        Az Ön véleményei
      </Text>
      
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <Card key={review.id} shadow="sm" padding="lg" radius="md" withBorder mb="md">
            <Group align="flex-start" >


              <div style={{ flex: 1 }}>
                {/* Termék neve */}
                <Text size="md" fw={500} mb="xs">
                  {review.productName}
                </Text>
                
                {/* Értékelés */}
                <Rating value={review.rating} readOnly size="sm" />

                {/* Vélemény */}
                <Text size="sm" mt="xs">
                  {review.comment}
                </Text>

                {/* Dátum */}
                <Text size="xs" color="gray" mt="xs">
                  {new Date(review.createdAt).toLocaleDateString('hu-HU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </div>
            </Group>
          </Card>
        ))
      ) : (
        <Text color="gray" size="sm">
          Nincs még véleménye.
        </Text>
      )}
    </Container>
  );
};

export default ReviewPage;
