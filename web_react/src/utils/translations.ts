export const ORDER_STATUS_TRANSLATIONS: Record<string, string> = {
    PENDING: 'Függőben',
    PAID: 'Fizetve',
    CONFIRMED: 'Jóváhagyva',
    SHIPPED: 'Szállítás alatt',
    DELIVERED: 'Kézbesítve',
    CANCELED: 'Lemondva',
    

  };

  export const ORDER_SHIPPING_TRANSLATIONS: Record<string, string> = {
    HOME_DELIVERY: 'Házhoz szállítás',
    SHOP: 'Átvétel az üzletben',
    FOXPOST: 'Foxpost csomagautomata',
    PACKETA:'Packeta csomagautomata',
  };

  export const ORDER_PAYMENT_TRANSLATIONS: Record<string, string> = {
    CREDIT_CARD: 'Bankkártya',
    BANK_TRANSFER: 'Átutalással',
    CASH_ON_DELIVERY: 'Átvételkor készpénzben vagy bankkártyával',
    PAYPAL: 'PayPal',
  };

  export const ROLE_STATUS_TRANSLATIONS: Record<string, string> = {
    USER:'Felhasználó',
    ADMIN:'Adminisztrátor',
    MODERATOR:'Moderátor',
  };