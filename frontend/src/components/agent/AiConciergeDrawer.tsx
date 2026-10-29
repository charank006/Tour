import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, X, Send, Compass, MapPin, Lightbulb, Bot, User, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

interface Message {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  suggestedSpots?: string[];
  insiderTip?: string;
  time: string;
}

interface AiConciergeDrawerProps {
  currentDestination?: string;
  tripContext?: Record<string, any>;
  isOpen?: boolean;
  onClose?: () => void;
}

export const AiConciergeDrawer = ({
  currentDestination,
  tripContext,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}: AiConciergeDrawerProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeDestination, setActiveDestination] = useState(currentDestination || 'India');
  const [activeTripContext, setActiveTripContext] = useState<Record<string, any> | undefined>(tripContext);

  useEffect(() => {
    if (currentDestination) setActiveDestination(currentDestination);
  }, [currentDestination]);

  useEffect(() => {
    if (tripContext) setActiveTripContext(tripContext);
  }, [tripContext]);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      setInternalOpen(true);
      if (customEvent.detail?.destination) {
        setActiveDestination(customEvent.detail.destination);
      }
      if (customEvent.detail?.tripContext) {
        setActiveTripContext(customEvent.detail.tripContext);
      }
    };

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.destination) {
        setActiveDestination(customEvent.detail.destination);
      }
      if (customEvent.detail?.tripContext) {
        setActiveTripContext(customEvent.detail.tripContext);
      }
    };

    window.addEventListener('open-ai-concierge', handleOpen);
    window.addEventListener('update-ai-concierge-context', handleUpdate);
    return () => {
      window.removeEventListener('open-ai-concierge', handleOpen);
      window.removeEventListener('update-ai-concierge-context', handleUpdate);
    };
  }, []);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (externalOnClose && !val) {
      externalOnClose();
    } else {
      setInternalOpen(val);
    }
  };

  const defaultDestination = activeDestination || 'India';
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'concierge',
      text: `Hello traveler! I am your PlanYours Artisanal Concierge. Whether you need an off-the-radar tea stall in ${defaultDestination}, a quiet ridge for golden hour, or advice on pacing your days, I'm here to curate.`,
      suggestedSpots: ['Old Town Heritage Quarter', 'Scenic Ridge Trail', 'Artisan Tea Stall'],
      insiderTip: 'Early morning walks (before 8:00 AM) reveal authentic local street life before crowds gather.',
      time: 'Just now',
    },
  ]);

  const quickPrompts = [
    `Best quiet sunset overlook in ${defaultDestination}?`,
    `Local breakfast spots away from tourist traps?`,
    `How to pace this trip for slow travel?`,
    `What should I pack for current season?`,
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/agent/chat', {
        message: textToSend,
        destination: activeDestination || 'India',
        tripContext: activeTripContext || { destination: activeDestination },
      });

      const data = res.data?.data;
      const conciergeMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'concierge',
        text: data?.reply || 'Here is an artisanal recommendation for your journey.',
        suggestedSpots: data?.suggestedSpots,
        insiderTip: data?.insiderTip,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, conciergeMsg]);
    } catch (err) {
      console.warn('Agent chat error:', err);
      const fallbackMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'concierge',
        text: `For ${activeDestination || 'your journey'}, we recommend starting early around 7:30 AM before coaches arrive. Pair morning outdoor overlooks with a sheltered heritage cafe in the afternoon, and catch the golden hour from a high ridge or waterside promenade.`,
        suggestedSpots: ['Old Heritage Quarter', 'Sunrise Viewpoint', 'Local Tea Stall'],
        insiderTip: 'Carry cash for small street vendors and ask locals where they take their afternoon chai.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (when not using external control) */}
      {externalIsOpen === undefined && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#131D28] text-white px-4 py-3 rounded-full shadow-warm-xl border border-white/20 flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all duration-200 group cursor-pointer"
          aria-label="Open 24/7 AI Travel Concierge"
          title="Open AI Travel Concierge"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
          <Sparkles size={17} className="text-accent group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-semibold tracking-wide">
            <span className="hidden sm:inline">Ask </span>AI Concierge
          </span>
        </button>
      )}

      {/* Slide-over Drawer Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end"
            onClick={() => setOpen(false)}
          >
            {/* Drawer Content Card */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md h-full bg-card border-l border-border/80 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 border-b border-border/70 bg-muted/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif-display text-base font-bold text-foreground">
                        PlanYours Concierge
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        AI Assistant
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Cultural dispatches • {activeDestination ? `Focus: ${activeDestination}` : 'India Journeys'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Message Scroll View */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground font-medium rounded-br-none shadow-warm-sm'
                          : 'bg-muted/70 text-foreground border border-border/70 rounded-bl-none shadow-warm-sm'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Suggested Spots Chips */}
                      {msg.suggestedSpots && msg.suggestedSpots.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-border/50">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1.5">
                            Handpicked Spots:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.suggestedSpots.map((spot, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold bg-background/80 text-foreground px-2.5 py-1 rounded-lg border border-border/50"
                              >
                                <MapPin size={11} className="text-primary shrink-0" />
                                {spot}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Insider Tip Box */}
                      {msg.insiderTip && (
                        <div className="mt-2.5 p-2 rounded-xl bg-accent/10 border border-accent/20 text-foreground flex items-start gap-1.5 text-[11px]">
                          <Lightbulb size={13} className="text-accent shrink-0 mt-0.5" />
                          <span>{msg.insiderTip}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground italic p-2 bg-muted/40 rounded-xl w-fit">
                    <Sparkles size={13} className="text-accent animate-spin" />
                    <span>Curating artisanal recommendations...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="p-3 border-t border-border/50 bg-muted/20">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                  Traveler Inquiries:
                </div>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(prompt)}
                      className="text-[11px] font-medium whitespace-nowrap bg-background hover:bg-muted text-foreground/80 hover:text-foreground px-3 py-1.5 rounded-full border border-border/60 transition-colors shrink-0 cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3.5 border-t border-border/70 bg-card flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask about ${defaultDestination}...`}
                  className="flex-1 bg-muted/60 border border-border/60 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:bg-background"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:brightness-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  <Send size={15} />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiConciergeDrawer;
