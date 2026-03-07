import Navbar from '../../components/Navbar';
import Hero from './sections/Hero';
import NewArrivals from './sections/NewArrivals';
import BestSellers from './sections/BestSellers';
import Features from './sections/Features';
import MostProductCategories from './sections/MostProductCategories';
import FeaturedProducts from './sections/FeaturedProducts';
import LatestBlogs from './sections/LatestBlogs';
import MostViewedBlogs from './sections/MostViewedBlogs';
import ContactUs from './sections/ContactUs';
import Footer from '../../components/Footer';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <Hero />
            <MostProductCategories />
            <BestSellers />
            <FeaturedProducts />
            <NewArrivals />
            <Features />
            <LatestBlogs />
            <MostViewedBlogs />
            <ContactUs />

            <Footer />
        </div>
    );
};

export default Home;

