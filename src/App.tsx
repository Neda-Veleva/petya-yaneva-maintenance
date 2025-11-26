import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GalleryPage from './pages/GalleryPage';
import ServicesPage from './pages/ServicesPage';
import ServiceCategoryPage from './pages/ServiceCategoryPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import PromotionsPage from './pages/PromotionsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:category" element={<ServiceCategoryPage />} />
        <Route path="/services/:category/:serviceSlug" element={<ServiceDetailPage />} />
        <Route path="/promotions" element={<PromotionsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
