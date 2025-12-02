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
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOverview from './pages/admin/AdminOverview';
import ServicesManager from './pages/admin/ServicesManager';
import ServiceForm from './pages/admin/ServiceForm';
import CategoriesManager from './pages/admin/CategoriesManager';
import TopServicesManager from './pages/admin/TopServicesManager';
import BlogManager from './pages/admin/BlogManager';
import PromotionsManager from './pages/admin/PromotionsManager';
import TeamManager from './pages/admin/TeamManager';
import ReviewsManager from './pages/admin/ReviewsManager';
import PageTypesManager from './pages/admin/PageTypesManager';
import HomePageEditor from './pages/admin/HomePageEditor';

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
            <Route path="categories" element={<CategoriesManager />} />
            <Route path="top-services" element={<TopServicesManager />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="promotions" element={<PromotionsManager />} />
            <Route path="team" element={<TeamManager />} />
            <Route path="reviews" element={<ReviewsManager />} />
            <Route path="page-types" element={<PageTypesManager />} />
            <Route path="page-types/:pageTypeId/edit" element={<HomePageEditor />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
