import Category from "@/components/Home/Category";
import FeatureJobs from "@/components/Home/FeatureJobs";
import Hero from "@/components/Home/Hero";
import HowWorks from "@/components/Home/HowWorks";

const Home = () => {
  return (
    <section className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />
      {/* Categories Section */}
      <Category />
      {/* How It Works Section */}
      <HowWorks />
      {/* Featured Jobs Section */}
      <FeatureJobs />
    </section>
  );
};

export default Home;