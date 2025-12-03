import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import GalleryPage from './pages/GalleryPage';
import ServicesPage from './pages/ServicesPage';
import ServiceCategoryPage from './pages/ServiceCategoryPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import PromotionsPage from './pages/PromotionsPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import TeamPage from './pages/TeamPage';
import TeamMemberPage from './pages/TeamMemberPage';
import PricingPage from './pages/PricingPage';
import ReviewsPage from './pages/ReviewsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOverview from './pages/admin/AdminOverview';
import ServicesManager from './pages/admin/ServicesManager';
import ServiceForm from './pages/admin/ServiceForm';
import CategoriesManager from './pages/admin/CategoriesManager';
import CategoryForm from './pages/admin/CategoryForm';
import TopServicesManager from './pages/admin/TopServicesManager';
import BlogManager from './pages/admin/BlogManager';
import BlogForm from './pages/admin/BlogForm';
import PromotionsManager from './pages/admin/PromotionsManager';
import PromotionForm from './pages/admin/PromotionForm';
import TeamManager from './pages/admin/TeamManager';
import TeamMemberForm from './pages/admin/TeamMemberForm';
import ReviewsManager from './pages/admin/ReviewsManager';
import ReviewForm from './pages/admin/ReviewForm';
import TopServiceForm from './pages/admin/TopServiceForm';
import PageTypesManager from './pages/admin/PageTypesManager';
import HomePageEditor from './pages/admin/HomePageEditor';
import HeaderConfigManager from './pages/admin/HeaderConfigManager';
import ContactConfigManager from './pages/admin/ContactConfigManager';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:category" element={<ServiceCategoryPage />} />
          <Route path="/services/:category/:serviceSlug" element={<ServiceDetailPage />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/team/:slug" element={<TeamMemberPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="services/new" element={<ServiceForm />} />
            <Route path="services/edit/:id" element={<ServiceForm />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/edit/:id" element={<CategoryForm />} />
            <Route path="categories" element={<CategoriesManager />} />
            <Route path="top-services/new" element={<TopServiceForm />} />
            <Route path="top-services/edit/:id" element={<TopServiceForm />} />
            <Route path="top-services" element={<TopServicesManager />} />
            <Route path="blog/new" element={<BlogForm />} />
            <Route path="blog/edit/:id" element={<BlogForm />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="promotions/new" element={<PromotionForm />} />
            <Route path="promotions/edit/:id" element={<PromotionForm />} />
            <Route path="promotions" element={<PromotionsManager />} />
            <Route path="team/new" element={<TeamMemberForm />} />
            <Route path="team/edit/:id" element={<TeamMemberForm />} />
            <Route path="team" element={<TeamManager />} />
            <Route path="reviews/new" element={<ReviewForm />} />
            <Route path="reviews/edit/:id" element={<ReviewForm />} />
            <Route path="reviews" element={<ReviewsManager />} />
            <Route path="header-config" element={<HeaderConfigManager />} />
            <Route path="contact-config" element={<ContactConfigManager />} />
            <Route path="page-types" element={<PageTypesManager />} />
            <Route path="page-types/:pageTypeId/edit" element={<HomePageEditor />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
