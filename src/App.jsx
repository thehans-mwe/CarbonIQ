import { useState, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Features from './components/Features';
import CTA from './components/CTA';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import { fetchCarbonEstimate, fetchRecommendations } from './services/api';
import { DEMO_INPUTS, DEMO_CARBON, DEMO_RECOMMENDATIONS } from './services/demoData';

// Lazy-load heavy components (Calculator + ResultsDashboard include Recharts, CountUp, etc.)
const Calculator = lazy(() => import('./components/Calculator'));
const ResultsDashboard = lazy(() => import('./components/ResultsDashboard'));

// views: 'landing' | 'calculator' | 'results'

const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(6px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function App() {
  const [view, setView] = useState('landing');
  const [showSplash, setShowSplash] = useState(true);
  const [carbonData, setCarbonData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [inputs, setInputs] = useState(null);

  const goLanding = useCallback(() => { setView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
  const goCalculator = useCallback(() => { setView('calculator'); window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  // Navigate to a section on the landing page (used by Navbar)
  const goToSection = useCallback((sectionId) => {
    if (view !== 'landing') {
      setView('landing');
      // Wait for landing to render, then scroll
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [view]);

  // Calculate from user input
  const handleCalculate = useCallback(async (formData) => {
    setInputs(formData);

    // Step 1: carbon estimate (API with offline fallback)
    const carbon = await fetchCarbonEstimate(formData);
    setCarbonData(carbon);
    setRecommendations(null); // clear while loading
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Step 2: AI recommendations (async, arrives after)
    const recs = await fetchRecommendations(carbon, formData);
    setRecommendations(recs);
  }, []);

  // Demo mode
  const handleDemo = useCallback(() => {
    setInputs(DEMO_INPUTS);
    setCarbonData(DEMO_CARBON);
    setRecommendations(DEMO_RECOMMENDATIONS);
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onFinished={() => setShowSplash(false)} />}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="min-h-screen animated-gradient-bg noise-overlay"
        >
        <Navbar onDashboard={goCalculator} onNavigateSection={goToSection} />

        {view === 'landing' && (
          <>
            <Hero onGetStarted={goCalculator} onDemo={handleDemo} />
            <Dashboard />
            <Features />
            <Testimonials />
            <About />
            <CTA onGetStarted={goCalculator} />
            <Footer />
          </>
        )}

        {view === 'calculator' && (
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent-green/20 border-t-accent-green rounded-full animate-spin" /></div>}>
            <Calculator
              onCalculate={handleCalculate}
              onBack={goLanding}
              onDemo={handleDemo}
            />
          </Suspense>
        )}

        {view === 'results' && carbonData && (
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent-green/20 border-t-accent-green rounded-full animate-spin" /></div>}>
            <ResultsDashboard
              carbonData={carbonData}
              recommendations={recommendations}
              inputs={inputs}
              onBack={goLanding}
              onRecalculate={goCalculator}
            />
          </Suspense>
        )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
