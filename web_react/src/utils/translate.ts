import { ORDER_STATUS_TRANSLATIONS, ORDER_PAYMENT_TRANSLATIONS, ORDER_SHIPPING_TRANSLATIONS, ROLE_STATUS_TRANSLATIONS } from './translations';

export const translateOrderStatus = (status: string): string => {
  return ORDER_STATUS_TRANSLATIONS[status] || status;
};

export const translateOrderShipping = (shippingMethod: string): string => {
    return ORDER_SHIPPING_TRANSLATIONS[shippingMethod] || shippingMethod;
};

export const translateOrderPayment = (paymentMethod: string): string => {
    return ORDER_PAYMENT_TRANSLATIONS[paymentMethod] || paymentMethod;
};

export const translateRoleStatus = (role: string): string => {
  return ROLE_STATUS_TRANSLATIONS[role] || role;
};