import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const navItems = [
    { path: '/destinations', label: 'Destinations' },
    { path: '/activities', label: 'Activities' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/my-trips', label: 'My Trips' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const transparent = isHome && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-500 ${transparent
          ? 'bg-transparent border-transparent'
          : 'bg-[#0A1628]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Logo size="md" linkTo="/" imageUrl="/logo.png" />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(item.path)
                    ? 'text-white'
                    : 'text-white/55 hover:text-white hover:bg-white/[0.08]'
                  }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/10 border border-white/10 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            ))}

            <Link
              to="/plan"
              className="ml-4 btn-accent text-sm font-bold px-5 py-2.5 rounded-full"
            >
              Start Planning
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOpen ? 'x' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="block"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-2 pb-4 border-t border-white/[0.07] mt-2 flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={item.path}
                      className={`block px-4 py-3 rounded-xl text-sm transition-colors ${isActive(item.path)
                          ? 'text-white bg-white/10 font-semibold'
                          : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                        }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.26 }}>
                  <Link
                    to="/plan"
                    className="block mt-2 text-center btn-accent text-sm font-bold py-3 rounded-full"
                  >
                    Start Planning
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
