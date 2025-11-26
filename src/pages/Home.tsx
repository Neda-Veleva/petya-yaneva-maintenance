import { useState, useEffect } from 'react';
import Header from '../components/Header';
import IntroHero from '../components/IntroHero';
import Hero from '../components/Hero';
import TopServiceSlider from '../components/TopServiceSlider';
import Services from '../components/Services';
import BrandsSlider from '../components/BrandsSlider';
import GallerySlider from '../components/GallerySlider';
import PriceList from '../components/PriceList';
import Reviews from '../components/Reviews';
import Blog from '../components/Blog';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { getTopServices, TopService } from '../lib/supabase';

export default function Home() {
  const [topServices, setTopServices] = useState<TopService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopServices() {
      const services = await getTopServices(null);
      setTopServices(services);
      setLoading(false);
    }

    loadTopServices();
  }, []);

  return (
    <div className="min-h-screen bg-dark-500">
      <Header />
      {!loading && topServices.length > 0 ? (
        <TopServiceSlider
          introSlide={{
            title: 'Lashes by Petya Yaneva',
            description: 'Открийте света на луксозната грижа за мигли',
            image_url: 'https://images.unsplash.com/photo-1548902378-2ec44c906391?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWUlMjBtYWtldXAlMjBsYXNoZXN8ZW58MXx8fHwxNzYzMTM0MTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
          }}
          topServices={topServices}
        />
      ) : (
        <IntroHero />
      )}
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
