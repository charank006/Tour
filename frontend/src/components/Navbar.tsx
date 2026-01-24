import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navItems = [
    { path: '/destinations', label: 'Destinations' },
    { path: '/activities', label: 'Activities' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/my-trips', label: 'My Trips' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Placeholder for future logo image.
  // Replace undefined with require/import path or public URL string, e.g., '/logo.png'
  const logoUrl = '/logo.png';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-white/5 shadow-lg py-4 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo size="md" linkTo="/" imageUrl={logoUrl} className="" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative nav-link text-sm font-medium transition-colors ${isActive(item.path)
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
                  }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Link>
            ))}
            <Link
              to="/plan"
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6 py-2.5 text-sm font-bold shadow-orange hover:shadow-elevated transition-all"
            >
              Start Planning
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/5 animate-fade-in bg-primary absolute top-full left-0 right-0 shadow-xl">
            <div className="flex flex-col gap-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link text-center text-lg py-2 ${isActive(item.path) ? 'text-accent font-bold' : 'text-white/60'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/plan"
                className="bg-accent text-accent-foreground text-center mt-4 mx-4 py-3 rounded-full font-bold shadow-orange"
                onClick={() => setIsOpen(false)}
              >
                Start Planning
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
