import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider } from '@mantine/core';
import { MantineEmotionProvider } from "@mantine/emotion";
import { Notifications } from '@mantine/notifications';
import { NotificationProvider } from "./context/NotificationContext";
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import RegisterPage from "./pages/RegisterPage";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminOrder from './pages/admin/AdminOrder';
import AdminUser from "./pages/admin/AdminUser";
import AdminImport from "./pages/admin/AdminImport";
import AppHeader from './components/AppHeader';
import CategoryBar from "./components/CategoryBar";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserProfile from "./pages/UserProfile";
import ThankYouPage from "./pages/ThankYouPage";
import CancelPage from "./pages/CancelPage";
import OrderPage from './pages/OrderPage';
import ReviewPage from "./pages/ReviewPage";
import FavoritePage from "./pages/FavoritePage";
import { FavoriteProvider } from "./context/FavoriteContext";
import { CartProvider } from "./context/CartContext";
import { DropdownProvider } from "./context/DropdownContext";
import { PaymentProvider } from './context/PaymentContext';
import { ShippingProvider } from './context/ShippingContext';
import CartPage from "./pages/CartPage";
import "./App.css";
import AdminCouponsPage from "./pages/admin/AdminCouponsPage";
import AdminShipping from "./pages/admin/AdminShipping";
import Footer from './components/Footer';




const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineEmotionProvider>
        <MantineProvider>
          {/* Notifications csak renderelésre használjuk, pozíciót nem fogad el */}
          <Notifications zIndex={9999} limit={3} position="top-right" />
          <NotificationProvider>
            <ModalsProvider>
            <PaymentProvider>
            <ShippingProvider>
              <FavoriteProvider>
                <CartProvider>
                  <DropdownProvider>
                    <Router>
                      <CategoryBar />
                      <AppHeader />
                      <main style={{ paddingTop: "100px" }}> 
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/products" element={<ProductsPage />} />
                          <Route path="/register" element={<RegisterPage />} />

                          <Route path="/profile" element={<UserProfile />} />
                          <Route path="/profile/orders" element={<OrderPage />} />
                          <Route path="/profile/favorites" element={<FavoritePage />} />
                          <Route path="/profile/reviews" element={<ReviewPage />} />

                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/success" element={<ThankYouPage />} />
                          <Route path="/cancel" element={<CancelPage />} />

                          <Route path="/unauthorized" element={<UnauthorizedPage />} />

                          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                          <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProduct /></ProtectedRoute>} />
                          <Route path="/admin/order" element={<ProtectedRoute adminOnly><AdminOrder /></ProtectedRoute>} />
                          <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUser /></ProtectedRoute>} />
                          <Route path="/admin/coupons" element={<ProtectedRoute adminOnly><AdminCouponsPage /></ProtectedRoute>} />
                          <Route path="/admin/shippings" element={<ProtectedRoute adminOnly><AdminShipping /></ProtectedRoute>} />
                          <Route path="/admin/import" element={<ProtectedRoute adminOnly><AdminImport /></ProtectedRoute>} />
                        </Routes>
                      </main>
                      <Footer />
                    </Router>
                  </DropdownProvider>
                </CartProvider>
              </FavoriteProvider>
              </ShippingProvider>
              </PaymentProvider>
            </ModalsProvider>
          </NotificationProvider>
        </MantineProvider>
      </MantineEmotionProvider>
    </QueryClientProvider>
  );
}

export default App;
