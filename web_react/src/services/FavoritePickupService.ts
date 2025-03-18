import api from './api';

export const getFavoritePickupPoint = async () => {
  const response = await api.get('/api/users/favorite-pickup-point');
  return response.data;
};

export const saveFavoritePickupPoint = async (pickupPoint: any) => {
  const response = await api.post('/api/users/favorite-pickup-point', pickupPoint);
  return response.data;
};
