import { useState, useEffect } from 'react';
import { Stepper, Container } from '@mantine/core';
import { useCart } from '../context/CartContext';
import { useShipping } from '../hooks/useShipping';
import { useCoupon } from '../hooks/useCoupon';
import { useNavigate } from 'react-router-dom';
import useOrder from '../hooks/useOrder';
import CartSummary from '../components/cart/CartSummary';
import BillingStep from '../components/cart/BillingStep';
import ShippingStep from '../components/cart/ShippingStep';
import OrderDetailsStep from '../components/cart/OrderDetailsStep';
import { FoxpostPoint } from '../types';
import { useNotification } from "../context/NotificationContext";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity , clearCart} = useCart();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const { showInfo, showSuccess, showError } = useNotification();

  const { applyCoupon, clearCoupon } = useCoupon();
  const { createOrder, loading } = useOrder();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
  const [selectedShippingPoint, setSelectedShippingPoint] = useState<FoxpostPoint | null>(null);
  const [homeDeliveryAddress, setHomeDeliveryAddress] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const cashOnShopAddress = '1098 Budapest, Távíró utca 15/1';
  const { shippingCost, error: shippingError, fetchShippingCost } = useShipping(subtotal, selectedShippingMethod);
  const [selectedBilling, setSelectedBilling] = useState<string | null>(null);
  const [billingData, setBillingData] = useState<any>({
    companyName: '',
    taxNumber: null,
    street: '',
    city: '',
    postalCode: '',
    country: '',
    billingType: '',
  });

  useEffect(() => {
    if (selectedShippingMethod) {
      fetchShippingCost(selectedShippingMethod);
    }
  }, [selectedShippingMethod]);

  const handleApplyCoupon = async () => {
    if (couponCode.trim()) {
      const discountPercentage = await applyCoupon(couponCode, true);
      if (discountPercentage > 0) {
        const discountValue = (subtotal * discountPercentage) / 100;
        setDiscount(discountValue);
        showSuccess('Sikeres kupon aktiválás!');
      } else {
        showError('Érvénytelen kuponkód!');
      }
    }
  };
  
  const handleClearCoupon = () => {
    if (couponCode) { 
        clearCoupon(); 
        setDiscount(0); 
        setCouponCode(''); 
        showSuccess('Kupon sikeresen eltávolítva!');
    } else {
        showInfo('Nincs felhasznált kupon.');
    }
};

  const handleSaveBilling = async () => {
    try {
      console.log('Billing adatok mentése:', billingData);
      setSelectedBilling(null);
    } catch (error) {
      console.error('Hiba számlázási adatok mentésekor:', error);
    }
  };

  const handleOrderSubmit = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('❌ Nincs felhasználói azonosító!');
      return;
  }
    try {
      const orderData = {
        userId,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod: selectedPaymentMethod === 'bankcard'
          ? 'CREDIT_CARD'
          : selectedPaymentMethod === 'cash'
          ? 'CASH_ON_DELIVERY'
          : 'BANK_TRANSFER',
        shippingMethod: selectedShippingMethod === 'foxpost'
          ? 'FOXPOST'
          : selectedShippingMethod === 'home'
          ? 'HOME_DELIVERY'
          : 'SHOP',
          shippingPoint: selectedShippingPoint
          ? selectedShippingPoint.place_id
          : null,
        shippingAddress: homeDeliveryAddress,
        shippingCost: shippingCost,
        billingData,
        totalPrice: subtotal,
        finalPrice: subtotal + (shippingCost || 0) - discount,
        couponCode: couponCode || null,
        discountAmount: discount || 0,
        discountName: couponCode || null,
        status: 'PENDING',
      };

      console.log('🔹 Rendelés adatok:', orderData);

      // ✅ API hívás a hook segítségével
      await createOrder(orderData);
      showSuccess('Rendelés sikeresen leadva!');
      console.log('✅ Rendelés sikeresen leadva!');
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('❌ Hiba történt a rendelés során:', error);
    }
  };

  return (
    <Container size="lg" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <Stepper active={activeStep} onStepClick={setActiveStep}>
        <Stepper.Step label="Kosár" />
        <Stepper.Step label="Számlázás" />
        <Stepper.Step label="Szállítás és fizetés" />
        <Stepper.Step label="Rendelés részletei" />
      </Stepper>

      {activeStep === 0 && (
        <CartSummary
          cart={cart}
          subtotal={subtotal}
          couponCode={couponCode}
          couponMessage={couponMessage}
          setCouponCode={setCouponCode}
          handleApplyCoupon={handleApplyCoupon}
          handleClearCoupon={handleClearCoupon}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          discount={discount}
          setDiscount={setDiscount}
          onNext={() => setActiveStep(1)}
        />
      )}

      {activeStep === 1 && (
        <BillingStep
          selectedBilling={selectedBilling}
          setSelectedBilling={setSelectedBilling}
          billingData={billingData}
          setBillingData={setBillingData}
          handleSaveBilling={handleSaveBilling}
          onPrev={() => setActiveStep(0)}
          onNext={() => setActiveStep(2)}
        />
      )}

      {activeStep === 2 && (
        <ShippingStep
          cart={cart}
          subtotal={subtotal}
          shippingCost={shippingCost}
          discount={discount}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          selectedShippingMethod={selectedShippingMethod}
          setSelectedShippingMethod={setSelectedShippingMethod}
          selectedShippingPoint={selectedShippingPoint}
          setSelectedShippingPoint={setSelectedShippingPoint}
          homeDeliveryAddress={homeDeliveryAddress}
          setHomeDeliveryAddress={setHomeDeliveryAddress}
          cashOnShopAddress={cashOnShopAddress}
          fetchShippingCost={fetchShippingCost}
          onPrev={() => setActiveStep(1)}
          onNext={() => setActiveStep(3)}
        />
      )}

{activeStep === 3 && (
<OrderDetailsStep
  cart={cart}
  subtotal={subtotal}
  total={subtotal + shippingCost - discount}
  discount={discount}
  shippingCost={shippingCost}
  selectedPaymentMethod={selectedPaymentMethod}
  selectedShippingMethod={selectedShippingMethod}
  selectedShippingPoint={selectedShippingPoint}
  homeDeliveryAddress={homeDeliveryAddress}
  cashOnShopAddress={cashOnShopAddress}
  bankTransferAccount="Globify Kft, HU12 1234 5678 9012 3456 7890 1234, BankBank"
  onPrev={() => setActiveStep(2)}
  onSubmit={handleOrderSubmit}
  loading={loading}
/>
)}
    </Container>
  );
};

export default CartPage;
