import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/destinations', label: 'Destinations' },
    { path: '/activities', label: 'Curated Experiences' },
    { path: '/reviews', label: 'Field Notes' },
    { path: '/my-trips', label: 'My Journeys' },
  ];

  const { scrollYProgress } = useScroll();
  const isActive = (path: string) => location.pathname === path;
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-editorial ${
        isTransparent
          ? 'bg-gradient-to-b from-black/50 via-black/20 to-transparent py-4'
          : 'bg-background/92 backdrop-blur-md border-b border-border/80 shadow-warm-sm py-3'
      }`}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary z-50 pointer-events-none"
      />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-12 md:h-14">

          {/* Editorial Logo */}
          <Logo
            size="md"
            linkTo="/"
            variant={isTransparent ? 'light' : 'auto'}
          />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    isTransparent
                      ? active
                        ? 'text-white font-semibold'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                      : active
                      ? 'text-primary font-semibold'
                      : 'text-foreground/75 hover:text-foreground hover:bg-muted/80'
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className={`absolute inset-0 rounded-full -z-10 ${
                        isTransparent
                          ? 'bg-white/15 border border-white/20'
                          : 'bg-primary/10 border border-primary/20'
                      }`}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* AI Concierge Trigger */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-concierge'))}
              className={`ml-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                isTransparent
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-sm'
                  : 'bg-primary/10 hover:bg-primary/15 text-primary border-primary/20 shadow-sm'
              }`}
              title="Open 24/7 AI Travel Concierge"
            >
              <Sparkles size={13} className="text-accent animate-pulse" />
              <span>AI Concierge</span>
            </button>

            {/* Primary Action Button */}
            <Link
              to="/plan"
              className="ml-2 inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-full shadow-warm hover:brightness-105 active:scale-[0.98] transition-all duration-200"
            >
              <Sparkles size={15} />
              <span>Plan a Trip</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2.5 rounded-full transition-colors ${
              isTransparent
                ? 'text-white hover:bg-white/15'
                : 'text-foreground hover:bg-muted'
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Slide-down Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden bg-card/98 backdrop-blur-xl border border-border/80 rounded-2xl mt-2 p-4 shadow-warm-lg"
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-primary bg-primary/10 font-semibold'
                        : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* AI Concierge Mobile Item */}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    window.dispatchEvent(new CustomEvent('open-ai-concierge'));
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-foreground/90 hover:bg-muted text-left transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Sparkles size={18} className="text-accent" />
                    <span>AI Travel Concierge</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    Online
                  </span>
                </button>

                <div className="pt-3 mt-2 border-t border-border/60">
                  <Link
                    to="/plan"
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 px-5 rounded-full shadow-warm active:scale-[0.98] transition-transform"
                  >
                    <Sparkles size={16} />
                    <span>Plan a Trip</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
