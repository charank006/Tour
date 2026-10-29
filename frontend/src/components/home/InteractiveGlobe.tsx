import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { Compass, MapPin } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

export const InteractiveGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let phi = 1.2;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    if (!canvasRef.current) return;

    // Rich Cobe Globe with high-contrast terrestrial definition
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 1.2,
      theta: 0.35,
      dark: 1, // Deep contrast sphere so terrain dots pop vividly
      diffuse: 1.3,
      mapSamples: 20000,
      mapBrightness: 6.0,
      baseColor: [0.11, 0.16, 0.22], // Deep midnight navy sphere
      markerColor: [0.92, 0.38, 0.18], // Terracotta #C4512C marker glow
      glowColor: [0.28, 0.42, 0.58], // Ambient atmospheric twilight ring
      markers: [
        { location: [32.2432, 77.1892], size: 0.08 }, // Manali
        { location: [26.9124, 75.7873], size: 0.08 }, // Jaipur
        { location: [15.2993, 74.124], size: 0.07 },  // Goa
        { location: [10.0889, 77.0595], size: 0.07 }, // Munnar
        { location: [25.3176, 82.9739], size: 0.07 }, // Varanasi
        { location: [28.6139, 77.209], size: 0.06 },  // Delhi
        { location: [34.0837, 74.7973], size: 0.07 }, // Srinagar
        { location: [25.5788, 91.8933], size: 0.07 }, // Shillong
      ],
      onRender: (state) => {
        if (!pointerInteracting.current && !prefersReducedMotion) {
          phi += 0.003;
        }
        state.phi = phi + pointerInteractionMovement.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [prefersReducedMotion]);

  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden border-t border-border/60">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">

          {/* Left Column Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
              <Compass size={13} />
              <span>Continental Scope</span>
            </div>

            <h2 className="font-serif-display text-fluid-h1 font-bold text-foreground tracking-tight leading-[1.12]">
              From high Himalayan passes to southern spice hills
            </h2>

            <p className="text-muted-foreground text-base leading-relaxed font-light">
              We focus deep rather than wide. Each pinned destination has been road-tested for driving pace, verified local tea houses, and seasonal road conditions.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/60 text-xs">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-primary" />
                <span className="font-semibold text-foreground">50+ Road-Tested Cities</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-semibold text-foreground">Interactive Subcontinent Map</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="font-handwriting text-xl text-primary font-bold -rotate-1 inline-block">
                "Drag the globe to explore coordinates"
              </span>
            </div>
          </div>

          {/* Right Column: 3D Interactive Cobe Globe */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            <div
              className="w-full max-w-[380px] aspect-square rounded-full shadow-warm-xl relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none bg-[#0D151F] ring-8 ring-primary/10 border border-white/10"
              onPointerDown={(e) => {
                pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
              }}
              onPointerUp={() => {
                pointerInteracting.current = null;
              }}
              onPointerOut={() => {
                pointerInteracting.current = null;
              }}
              onMouseMove={(e) => {
                if (pointerInteracting.current !== null) {
                  const delta = e.clientX - pointerInteracting.current;
                  pointerInteractionMovement.current = delta * 0.005;
                }
              }}
              onTouchMove={(e) => {
                if (pointerInteracting.current !== null && e.touches[0]) {
                  const delta = e.touches[0].clientX - pointerInteracting.current;
                  pointerInteractionMovement.current = delta * 0.005;
                }
              }}
            >
              <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', contain: 'layout paint size' }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InteractiveGlobe;
