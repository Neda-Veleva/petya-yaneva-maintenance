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
import TeamMemberPage from './pages/TeamMemberPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOverview from './pages/admin/AdminOverview';
import ServicesManager from './pages/admin/ServicesManager';

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
            <Route path="services" element={<ServicesManager />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
