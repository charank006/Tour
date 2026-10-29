import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export const FinalCta = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl md:rounded-4xl overflow-hidden shadow-warm-xl p-8 sm:p-12 md:p-16 text-center bg-[#131D28] text-white border border-[#233547]"
        >
          {/* Background Atmospheric Layer with Guaranteed Dark Underlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=85&w=2000&auto=format&fit=crop"
              alt="Golden hour coastline"
              className="w-full h-full object-cover opacity-35 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#131D28]/95 via-[#131D28]/80 to-[#131D28]" />
          </div>

          <div className="max-w-2xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#E06943] mb-6">
              <Sparkles size={13} />
              <span>Your Next Chapter Awaits</span>
            </div>

            <h2 className="font-serif-display text-fluid-h1 font-bold text-white mb-6 tracking-tight leading-[1.12]">
              Ready to leave the spreadsheets behind?
            </h2>

            <p className="text-base md:text-lg text-stone-300 font-light leading-relaxed mb-10 max-w-xl mx-auto">
              Tell us where you want to go. We will craft a journey that honors your tempo, your companions, and the authentic local rhythm.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/plan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full shadow-warm hover:brightness-105 active:scale-[0.98] transition-all text-base"
              >
                <span>Design Your Journey Free</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            <p className="mt-6 text-xs text-stone-400 font-light">
              No account required • Takes under 15 seconds • Fully customizable
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCta;
