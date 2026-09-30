// HPI 1.6-V
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useMember, BaseCrudService } from '@/integrations';
import { SystemSteps } from '@/entities';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { 
  ArrowRight, 
  Upload, 
  Camera, 
  BarChart3, 
  CheckCircle, 
  Cpu, 
  ScanLine, 
  Activity, 
  Zap,
  Database,
  Lock,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- Utility Components for "Living Experience" ---

// 1. Intersection Observer Reveal (Mandatory Pattern)
type AnimatedElementProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, className, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          element.classList.add('is-visible');
        }, delay);
        observer.unobserve(element);
      }
    }, { threshold: 0.15 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  return <div ref={ref} className={`reveal-trigger ${className || ''}`}>{children}</div>;
};

// 2. Sticky Section Wrapper
const StickySection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div className={`relative ${className || ''}`}>
      {children}
    </div>
  );
};

// --- Main Component ---

export default function HomePage() {
  // --- Data Fidelity Protocol: Identify & Canonize ---
  const { isAuthenticated, actions } = useMember();
  const [steps, setSteps] = useState<SystemSteps[]>([]);
  
  // Motion Hooks
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const heroParallax = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityParallax = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // --- Data Fidelity Protocol: Preserve & Utilize ---
  useEffect(() => {
    loadSteps();
  }, []);

  const loadSteps = async () => {
    const { items } = await BaseCrudService.getAll<SystemSteps>('systemsteps');
    const sortedSteps = items.sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0));
    setSteps(sortedSteps.filter(step => step.isActive));
  };

  const defaultSteps = [
    {
      icon: Upload,
      title: 'Upload Image',
      description: 'Upload a high-quality image of your fruit for instant AI analysis',
    },
    {
      icon: Camera,
      title: 'Live Webcam',
      description: 'Use real-time webcam feed for continuous quality monitoring',
    },
    {
      icon: BarChart3,
      title: 'Get Results',
      description: 'Receive detailed quality assessment with confidence scores',
    },
    {
      icon: CheckCircle,
      title: 'Take Action',
      description: 'Follow AI-powered recommendations for optimal decisions',
    },
  ];

  const activeSteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph selection:bg-primary selection:text-primary-foreground overflow-clip">
      {/* Scoped Styles for Bespoke Effects */}
      <style>{`
        .reveal-trigger {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .reveal-trigger.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .grid-overlay {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
        }

        .scan-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: #22C55E;
          box-shadow: 0 0 15px #22C55E;
          animation: scan 3s linear infinite;
        }

        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .glass-panel {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .tech-border-corner {
          position: absolute;
          width: 10px;
          height: 10px;
          border-color: #22C55E;
          border-style: solid;
          transition: all 0.3s ease;
        }
        
        .ticker-wrap {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
        }
        .ticker {
          display: inline-block;
          animation: ticker 30s linear infinite;
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-background z-0" />
        <div className="absolute inset-0 grid-overlay z-0 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-background/50 to-background z-0" />
        
        {/* Animated Abstract Shapes */}
        <motion.div 
          style={{ y: heroParallax }}
          className="absolute top-1/4 right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] z-0" 
        />
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]) }}
          className="absolute bottom-1/4 left-[10%] w-[300px] h-[300px] bg-warning/5 rounded-full blur-[80px] z-0" 
        />

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 max-w-[100rem]">
          <div className="flex flex-col items-center text-center">
            
            {/* Status Badge */}
            <AnimatedElement>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs font-heading tracking-widest uppercase text-primary">System Operational v2.4</span>
              </div>
            </AnimatedElement>

            {/* Headline */}
            <AnimatedElement delay={100}>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-bold text-white leading-tight tracking-tight mb-6">
                PRECISION <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary bg-[length:200%_auto] animate-gradient">
                  INTELLIGENCE
                </span>
              </h1>
            </AnimatedElement>

            {/* Subheadline */}
            <AnimatedElement delay={200}>
              <p className="text-xl md:text-2xl font-paragraph text-light-gray/80 max-w-3xl mx-auto mb-12 leading-relaxed">
                Advanced computer vision algorithms for real-time fruit quality assessment. 
                Detect defects, classify types, and ensure standard compliance with 99.8% accuracy.
              </p>
            </AnimatedElement>

            {/* CTA Buttons */}
            <AnimatedElement delay={300}>
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                {!isAuthenticated ? (
                  <Button
                    onClick={actions.login}
                    size="lg"
                    className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-none border-l-4 border-white/20 transition-all hover:translate-x-1"
                  >
                    Initialize System <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                ) : (
                  <Link to="/dashboard">
                    <Button
                      size="lg"
                      className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-none border-l-4 border-white/20 transition-all hover:translate-x-1"
                    >
                      Access Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                )}
                <Link to="/instructions">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-8 text-lg border-white/10 text-white hover:bg-white/5 rounded-none transition-all"
                  >
                    View Protocols
                  </Button>
                </Link>
              </div>
            </AnimatedElement>
          </div>
        </div>

        {/* Hero Visual / Dashboard Preview */}
        <motion.div 
          style={{ opacity: opacityParallax, y: useTransform(scrollYProgress, [0, 0.5], [0, 100]) }}
          className="relative w-full max-w-6xl mx-auto mt-20 px-4 z-10"
        >
          <div className="relative aspect-[21/9] bg-[#0F172A] rounded-t-xl border-t border-x border-white/10 overflow-hidden shadow-2xl">
            {/* Mock UI Header */}
            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <div className="ml-4 h-4 w-32 bg-white/10 rounded-sm" />
            </div>
            {/* Mock UI Content */}
            <div className="p-8 grid grid-cols-3 gap-8 h-full">
              <div className="col-span-2 bg-white/5 rounded-lg border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanLine className="w-16 h-16 text-primary/20 group-hover:text-primary/50 transition-colors duration-500" />
                </div>
                <div className="scan-line" />
                <div className="absolute bottom-4 left-4 font-mono text-xs text-primary">SCANNING_SEQUENCE_INITIATED...</div>
              </div>
              <div className="col-span-1 space-y-4">
                <div className="h-24 bg-white/5 rounded-lg border border-white/5 p-4">
                  <div className="text-xs text-gray-400 mb-2">CONFIDENCE_SCORE</div>
                  <div className="text-3xl font-heading text-primary">98.5%</div>
                  <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[98.5%]" />
                  </div>
                </div>
                <div className="h-24 bg-white/5 rounded-lg border border-white/5 p-4">
                  <div className="text-xs text-gray-400 mb-2">DEFECT_DETECTED</div>
                  <div className="text-3xl font-heading text-white">NONE</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- DATA TICKER --- */}
      <div className="w-full bg-primary/5 border-y border-primary/10 py-3 overflow-hidden">
        <div className="ticker-wrap">
          <div className="ticker font-mono text-sm text-primary/80 tracking-widest">
            SYSTEM_STATUS: ONLINE • LATENCY: 12MS • GPU_LOAD: 34% • ACTIVE_NODES: 12 • LAST_SCAN: 0.4S AGO • DEFECT_RATE: 0.02% • QUEUE: EMPTY • SYSTEM_STATUS: ONLINE • LATENCY: 12MS • GPU_LOAD: 34% • ACTIVE_NODES: 12 • LAST_SCAN: 0.4S AGO • DEFECT_RATE: 0.02% • QUEUE: EMPTY •
          </div>
        </div>
      </div>

      {/* --- HOW IT WORKS (Sticky Layout) --- */}
      <section className="relative py-32 bg-background">
        <div className="container mx-auto px-6 max-w-[100rem]">
          <div className="flex flex-col lg:flex-row gap-20">
            
            {/* Sticky Header/Intro */}
            <div className="lg:w-1/3">
              <div className="sticky top-32">
                <AnimatedElement>
                  <h2 className="text-5xl font-heading font-bold text-white mb-6">
                    SYSTEM <br /> PROTOCOLS
                  </h2>
                  <p className="text-lg text-light-gray/60 mb-8 leading-relaxed">
                    Our analysis pipeline follows a strict four-stage process to ensure maximum accuracy and reliability in fruit quality assessment.
                  </p>
                  <div className="hidden lg:block">
                    <Link to="/instructions">
                      <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 hover:bg-transparent group">
                        Detailed Documentation <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </AnimatedElement>
              </div>
            </div>

            {/* Scrolling Steps */}
            <div className="lg:w-2/3 space-y-24">
              {activeSteps.map((step, index) => {
                const IconComponent = 'icon' in step ? step.icon : null;
                return (
                  <AnimatedElement key={index} delay={index * 100}>
                    <div className="group relative pl-8 border-l border-white/10 hover:border-primary/50 transition-colors duration-500">
                      {/* Step Number */}
                      <div className="absolute -left-[25px] top-0 w-12 h-12 bg-background border border-white/10 group-hover:border-primary group-hover:text-primary rounded-full flex items-center justify-center text-lg font-heading font-bold text-white/50 transition-all duration-300 z-10">
                        0{index + 1}
                      </div>

                      <div className="glass-panel p-8 md:p-12 rounded-2xl hover:bg-white/5 transition-all duration-500 group-hover:translate-x-2">
                        <div className="flex items-start justify-between mb-6">
                          <div className="p-4 bg-primary/10 rounded-lg text-primary">
                            {step.stepIcon ? (
                              <Image
                                src={step.stepIcon}
                                alt={step.stepTitle || ''}
                                width={32}
                                className="w-8 h-8 object-contain"
                              />
                            ) : IconComponent ? (
                              <IconComponent className="w-8 h-8" />
                            ) : (
                              <Activity className="w-8 h-8" />
                            )}
                          </div>
                          <div className="text-xs font-mono text-white/30 uppercase tracking-widest">
                            Step_0{index + 1}
                          </div>
                        </div>
                        
                        <h3 className="text-3xl font-heading font-bold text-white mb-4">
                          {step.stepTitle || ('title' in step ? step.title : '')}
                        </h3>
                        <p className="text-lg text-light-gray/70 leading-relaxed">
                          {step.stepDescription || ('description' in step ? step.description : '')}
                        </p>
                        
                        {step.callToActionText && step.callToActionUrl && (
                          <div className="mt-8 pt-8 border-t border-white/5">
                            <a href={step.callToActionUrl} className="text-sm font-bold text-white hover:text-primary transition-colors flex items-center gap-2">
                              {step.callToActionText} <ArrowRight className="w-4 h-4" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </AnimatedElement>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURE SHOWCASE (Full Bleed Split) --- */}
      <section className="relative py-32 bg-[#0B1120] overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-[100rem]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Left: Content */}
            <div className="relative z-10">
              <AnimatedElement>
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-5 h-5 text-warning" />
                  <span className="text-warning font-mono text-sm tracking-widest uppercase">Core Technology</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-heading font-bold text-white mb-8 leading-tight">
                  NEURAL NETWORK <br /> ARCHITECTURE
                </h2>
                <p className="text-xl text-light-gray/60 mb-12 leading-relaxed max-w-xl">
                  Built on a custom-trained Convolutional Neural Network (CNN), our system processes visual data at the edge, delivering laboratory-grade analysis in milliseconds.
                </p>
              </AnimatedElement>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Database, title: "Big Data Training", desc: "Trained on 1M+ samples" },
                  { icon: Lock, title: "Secure Processing", desc: "End-to-end encryption" },
                  { icon: Cpu, title: "Edge Computing", desc: "< 50ms inference time" },
                  { icon: ScanLine, title: "Multi-Spectral", desc: "RGB + Depth analysis" }
                ].map((feature, i) => (
                  <AnimatedElement key={i} delay={i * 100}>
                    <div className="p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors rounded-lg">
                      <feature.icon className="w-6 h-6 text-primary mb-4" />
                      <h4 className="text-lg font-heading font-bold text-white mb-2">{feature.title}</h4>
                      <p className="text-sm text-light-gray/50">{feature.desc}</p>
                    </div>
                  </AnimatedElement>
                ))}
              </div>
            </div>

            {/* Right: Visual Visualization */}
            <div className="relative h-[600px] w-full">
              <StickySection className="h-full w-full flex items-center justify-center">
                <div className="relative w-full h-full bg-black/40 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm">
                  {/* Abstract Data Visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-64 h-64">
                      <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-[spin_10s_linear_infinite]" />
                      <div className="absolute inset-4 border-2 border-dashed border-white/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-heading font-bold text-white">99.8%</div>
                          <div className="text-xs font-mono text-primary mt-1">ACCURACY_RATE</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Data Cards */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 right-10 p-4 bg-background/80 border border-white/10 rounded-lg backdrop-blur-md shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-mono text-xs text-white">NODE_01: ACTIVE</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 left-10 p-4 bg-background/80 border border-white/10 rounded-lg backdrop-blur-md shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="font-mono text-xs text-white">PROCESSING: 450 FPS</span>
                    </div>
                  </motion.div>
                </div>
              </StickySection>
            </div>
          </div>
        </div>
      </section>

      {/* --- LARGE IMAGE BREAK (Parallax) --- */}
      <section className="relative h-[70vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://static.wixstatic.com/media/1c4410_633c4780d77b42fb8a3d29c859effd0b~mv2.png?originWidth=1152&originHeight=384" 
            alt="Advanced Laboratory Setup"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-6">
          <AnimatedElement>
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-8">
              "The standard for automated agricultural quality control."
            </h2>
            <div className="flex justify-center gap-4">
              <div className="h-1 w-20 bg-primary rounded-full" />
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-50" />
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="glass-panel p-12 md:p-20 rounded-3xl text-center border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[100px] pointer-events-none" />
            
            <AnimatedElement>
              <h2 className="text-5xl md:text-7xl font-heading font-bold text-white mb-8">
                READY TO DEPLOY?
              </h2>
              <p className="text-xl text-light-gray/70 mb-12 max-w-2xl mx-auto">
                Join the network of automated quality control labs. Initialize your dashboard to begin analysis.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                {!isAuthenticated ? (
                  <Button
                    onClick={actions.login}
                    size="lg"
                    className="h-16 px-10 text-xl bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-transform hover:scale-105 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                  >
                    Initialize System
                  </Button>
                ) : (
                  <Link to="/dashboard">
                    <Button
                      size="lg"
                      className="h-16 px-10 text-xl bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-transform hover:scale-105 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                    >
                      Launch Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}