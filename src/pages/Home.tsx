import Header from '../components/Header';
import IntroHero from '../components/IntroHero';
import Hero from '../components/Hero';
import Services from '../components/Services';
import BrandsSlider from '../components/BrandsSlider';
import GallerySlider from '../components/GallerySlider';
import PriceList from '../components/PriceList';
import Reviews from '../components/Reviews';
import Blog from '../components/Blog';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-500">
      <Header />
      <IntroHero />
      <div id="main-hero">
        <Hero />
      </div>
      <Services />
      <PriceList />
      <Reviews />
      <GallerySlider />
      <Blog />
      <Contact />
      <BrandsSlider />
      <Footer />
    </div>
  );
}
