import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';

const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function App() {
  return (
    <AnimatePresence>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="min-h-screen animated-gradient-bg"
      >
        <Navbar />
        <Hero />
        <Dashboard />
        <Features />
        <CTA />
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}
