import { useCallback, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { StoreProvider } from "./context/StoreContext";
import { ReadyContext } from "./components/ui/Ready";
import { ScrollTrigger } from "./lib/gsap";
import { Loader } from "./components/Loader";
import { Cursor } from "./components/ui/Cursor";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Intro } from "./components/Intro";
import { Collections } from "./components/Collections";
import { ObjectStudy } from "./components/ObjectStudy";
import { FeaturedProducts } from "./components/shop/FeaturedProducts";
import { ArtisanStory } from "./components/ArtisanStory";
import { Process } from "./components/Process";
import { Bestsellers } from "./components/Bestsellers";
import { Heritage } from "./components/Heritage";
import { Testimonials } from "./components/Testimonials";
import { InstaGallery } from "./components/InstaGallery";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";
import { QuickView } from "./components/shop/QuickView";
import { CartDrawer } from "./components/shop/CartDrawer";
import { SearchOverlay } from "./components/shop/SearchOverlay";
import { PolicyDialog } from "./components/shop/PolicyDialog";
import { Toast } from "./components/shop/Toast";
import { WhatsAppFab } from "./components/WhatsAppFab";

export default function App() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const onHeroImage = useCallback(() => setHeroLoaded(true), []);

  // Freeze scrolling while the loader is up, always start from the top.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = loading ? "hidden" : "";
    if (!loading) ScrollTrigger.refresh();
  }, [loading]);

  // Layout shifts from fonts / late images → keep triggers accurate.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => undefined);
    const t = window.setTimeout(refresh, 2500);
    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <ReadyContext.Provider value={ready}>
          <a
            href="#shop"
            className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-ivory transition-transform focus:translate-y-0"
          >
            Skip to products
          </a>
          {loading && (
            <Loader
              heroLoaded={heroLoaded}
              onReady={() => setReady(true)}
              onDone={() => setLoading(false)}
            />
          )}
          <Cursor />
          <Navbar />
          <main>
            <Hero onImageLoaded={onHeroImage} />
            <Marquee />
            <Intro />
            <Collections />
            <ObjectStudy />
            <FeaturedProducts />
            <ArtisanStory />
            <Process />
            <Bestsellers />
            <Heritage />
            <Testimonials />
            <InstaGallery />
            <Newsletter />
          </main>
          <Footer />
          <WhatsAppFab />
          <QuickView />
          <CartDrawer />
          <SearchOverlay />
          <PolicyDialog />
          <Toast />
        </ReadyContext.Provider>
      </StoreProvider>
    </MotionConfig>
  );
}
