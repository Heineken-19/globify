import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider } from '@mantine/core';
import { MantineEmotionProvider } from "@mantine/emotion";
import { Notifications } from '@mantine/notifications';
import { NotificationProvider } from "./context/NotificationContext";
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
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
import ProductSlugPage from "./pages/ProductSlugPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserProfile from "./pages/UserProfile";
import ThankYouPage from "./pages/ThankYouPage";
import CancelPage from "./pages/CancelPage";
import OrderPage from './pages/OrderPage';
import ReviewPage from "./pages/ReviewPage";
import FavoritePage from "./pages/FavoritePage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import LoginPage from "./pages/LoginPage";
import UnsubscribePage from "./pages/UnsubscribePage";
import NewProducts from "./pages/NewProducts";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { FavoriteProvider } from "./context/FavoriteContext";
import { CartProvider } from "./context/CartContext";
import { DropdownProvider } from "./context/DropdownContext";
import { PaymentProvider } from './context/PaymentContext';
import { ShippingProvider } from './context/ShippingContext';
import { PageStateProvider } from "./context/usePageState";
import { ModalProvider } from "./context/ModalContext";
import CartPage from "./pages/CartPage";
import ScrollToTopButton from "./components/ScrollToTopButton";
import "./App.css";
import AdminCouponsPage from "./pages/admin/AdminCouponsPage";
import AdminShipping from "./pages/admin/AdminShipping";
import Footer from './components/Footer';
import RewardProgram from './components/RewardProgram';
import ContactPage from './support/ContactPage';
import FaqPage from './support/FaqPage';
import ReturnPolicyPage from './support/ReturnPolicyPage';
import AdminNewsPage from "./pages/admin/AdminNewsPage";
import GuestCheckoutPage from "./pages/GuestCheckoutPage";
import AdminBlogPage from "./pages/admin/AdminBlogPage";
import AdminBlogEditor from "./components/blog/AdminBlogEditor";
import BlogListPage from "./components/blog/BlogListPage";
import BlogDetailsPage from "./components/blog/BlogDetailsPage";

const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineEmotionProvider>
        <MantineProvider>
        <ModalProvider>
          <Notifications zIndex={9999} limit={3} position="top-right" />
          <NotificationProvider>
          <AuthProvider> 
          <PageStateProvider>
            <ModalsProvider>
              <PaymentProvider>
                <ShippingProvider>
                  <FavoriteProvider>
                    <CartProvider>
                      <DropdownProvider>
                      <Router>
                      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                          <CategoryBar />
                          <AppHeader />
                          <main style={{ flexGrow: 1, paddingTop: "150px" }}>
                            <Routes>
                              <Route path="/" element={<HomePage />} />
                              <Route path="/products" element={<ProductsPage />} />
                              <Route path="/products/new" element={<NewProducts />} />
                              <Route path="/products/:slug" element={<ProductSlugPage />} />

                              <Route path="/blog" element={<BlogListPage />} />
                              <Route path="/blog/:slug" element={<BlogDetailsPage />} />
                              
                              <Route path="/rewardprogram" element={<RewardProgram />} />



                              <Route path="/register" element={<RegisterPage />} />
                              <Route path="/login" element={<LoginPage />} />
                              <Route path="/guest-checkout" element={<GuestCheckoutPage />} />
                              <Route path="/verify-email" element={<VerifyEmailPage />} />
                              <Route path="/reset-password" element={<ResetPasswordPage />} />
                              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                              <Route path="/profile" element={<UserProfile />} />
                              <Route path="/profile/orders" element={<OrderPage />} />
                              <Route path="/profile/favorites" element={<FavoritePage />} />
                              <Route path="/profile/reviews" element={<ReviewPage />} />

                              <Route path="/cart" element={<CartPage />} />
                              <Route path="/success" element={<ThankYouPage />} />
                              <Route path="/cancel" element={<CancelPage />} />

                              <Route path="/unauthorized" element={<UnauthorizedPage />} />
                              <Route path="/unsubscribe" element={<UnsubscribePage />} />

                              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                              <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProduct /></ProtectedRoute>} />
                              <Route path="/admin/order" element={<ProtectedRoute adminOnly><AdminOrder /></ProtectedRoute>} />
                              <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUser /></ProtectedRoute>} />
                              <Route path="/admin/coupons" element={<ProtectedRoute adminOnly><AdminCouponsPage /></ProtectedRoute>} />
                              <Route path="/admin/shippings" element={<ProtectedRoute adminOnly><AdminShipping /></ProtectedRoute>} />
                              <Route path="/admin/import" element={<ProtectedRoute adminOnly><AdminImport /></ProtectedRoute>} />
                              <Route path="/admin/news" element={<ProtectedRoute adminOnly><AdminNewsPage /></ProtectedRoute>} />
                              <Route path="/admin/blog" element={<ProtectedRoute adminOnly><AdminBlogPage /></ProtectedRoute>} />
                              <Route path="/admin/blog/new" element={<ProtectedRoute adminOnly><AdminBlogEditor /></ProtectedRoute>} />
                              <Route path="/admin/blog/:slug" element={<ProtectedRoute adminOnly><AdminBlogEditor /></ProtectedRoute>} />


                              <Route path="/support/contact" element={<ContactPage />} />
                              <Route path="/support/faq" element={<FaqPage />} />
                              <Route path="/support/return-policy" element={<ReturnPolicyPage />} />
                            </Routes>
                          </main>
                          <Footer />
                          </div>
                          </Router>
                      </DropdownProvider>
                    </CartProvider>
                  </FavoriteProvider>
                </ShippingProvider>
              </PaymentProvider>
            </ModalsProvider>
            </PageStateProvider>
            </AuthProvider>
          </NotificationProvider>
          <ScrollToTopButton />
          </ModalProvider>
        </MantineProvider>
      </MantineEmotionProvider>
    </QueryClientProvider>
  );
}

export default App;
