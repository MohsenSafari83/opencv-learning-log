import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import Hero from "@/components/Hero";
import Quote from "@/components/Quote";
import Modules from "@/components/Modules";
import Projects from "@/components/Projects";
import Exercises from "@/components/Exercises";
import Progress from "@/components/Progress";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden transition-colors duration-500">
      <Background />
      <Navbar />
      <Hero />
      <Quote />
      <Modules />
      <Projects />
      <Exercises />
      <Progress />
      <Footer />
    </main>
  );
}
