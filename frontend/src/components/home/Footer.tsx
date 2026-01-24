import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import Logo from '../Logo';

const Footer = () => {
    return (
        <footer className="bg-foreground text-white py-16 md:py-24 border-t border-white/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="brightness-100 invert contrast-200">
                            {/* Using Logo but forcing white text via parent classes or props? 
                   Logo component has text-primary. I might need to style it or just use text.
                   Since Logo component uses strict classes, I'll just render text here for simplicity/control on dark bg.
               */}
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-2xl tracking-tight flex items-center">
                                    <span className="bg-accent text-white px-3 py-1 rounded-lg">Plan</span>
                                    <span className="ml-1 text-white">Yours</span>
                                </span>
                            </div>
                        </div>
                        <p className="text-white/60 leading-relaxed max-w-xs">
                            Curating your dream journeys with the power of AI. Experience the world, your way.
                        </p>
                    </div>

                    {/* About Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-6">About Us</h3>
                        <ul className="space-y-4 text-white/60">
                            {['Our Story', 'Careers', 'Blog', 'Press', 'Partners'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-accent transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-6">Support</h3>
                        <ul className="space-y-4 text-white/60">
                            {['Help Center', 'Safety Information', 'Cancellation Options', 'Contact Us'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-accent transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold text-lg mb-6">Get Travel Tips</h3>
                        <p className="text-white/60 mb-6">
                            Join our newsletter for exclusive deals and inspiration.
                        </p>
                        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full text-white placeholder-white/30 focus:outline-none focus:border-accent"
                            />
                            <button className="bg-accent hover:bg-accent/90 text-white p-3 rounded-xl transition-colors">
                                <Send size={20} />
                            </button>
                        </form>
                        <div className="flex gap-4 mt-8">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-accent hover:text-white transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
                    <p>© 2026 PlanYours Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
