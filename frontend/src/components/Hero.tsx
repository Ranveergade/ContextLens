// Premium: staggered word headline, cursor-tracking radial glow, floating orbs,
//          shine CTA with gradient sweep, feature pill springs, stat counter row
import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cpu, FileCheck, Target, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { prefersReducedMotion } from '../lib/utils';

interface HeroProps {
  onStartUpload: () => void;
  onTrySample: () => void;
}

const headlineWords = ['Understand', 'everything.', 'Act', 'on', 'what', 'matters.'];
const accentWords = new Set(['everything.', 'matters.']);

const features = [
  {
    icon: Cpu,
    title: 'Gemma 4 AI',
    desc: 'Structured document understanding without factual hallucination.',
    gradient: 'from-[#DBEAFE] to-[#EFF6FF]',
    iconColor: 'text-[#3B82F6]',
  },
  {
    icon: ShieldCheck,
    title: '"PROVE IT" Evidence',
    desc: 'Every item traceable to exact verbatim page snippets.',
    gradient: 'from-[#ECFDF5] to-[#F0FDF4]',
    iconColor: 'text-[#10B981]',
  },
  {
    icon: Target,
    title: 'Action Items',
    desc: 'Interactive workspace to check off tasks with state persistence.',
    gradient: 'from-[#FFFBEB] to-[#FEF3C7]',
    iconColor: 'text-[#F59E0B]',
  },
  {
    icon: FileCheck,
    title: 'Multi-Format',
    desc: 'Supports PDF, TXT specs, Excel sheets, and image screenshots.',
    gradient: 'from-[#FDF4FF] to-[#FAF5FF]',
    iconColor: 'text-[#8B5CF6]',
  },
];

const stats = [
  { value: '4', suffix: 'x', label: 'Faster Review' },
  { value: '100', suffix: '%', label: 'Source Cited' },
  { value: '25', suffix: 'MB', label: 'Max File Size' },
];

const shouldAnimate = !prefersReducedMotion();

export const Hero: React.FC<HeroProps> = ({ onStartUpload, onTrySample }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(40);
  const [isHovering, setIsHovering] = useState(false);

  // Spring-smoothed mouse tracking for glow
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 40 });

  useEffect(() => {
    if (!shouldAnimate) return;
    const unsubX = springX.on('change', (x) => setGlowPos(prev => ({ ...prev, x })));
    const unsubY = springY.on('change', (y) => setGlowPos(prev => ({ ...prev, y })));
    return () => { unsubX(); unsubY(); };
  }, [springX, springY]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = sectionRef.current;
    if (!el || !shouldAnimate) return;
    const rect = el.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <div
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative py-24 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center overflow-hidden"
    >
      {/* Cursor-following radial glow — spring-smoothed */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0.6,
          background: `radial-gradient(700px circle at ${glowPos.x}% ${glowPos.y}%, rgba(59,130,246,0.13), rgba(96,165,250,0.06) 40%, transparent 65%)`,
        }}
        aria-hidden="true"
      />

      {/* Floating orbs — layered depth */}
      <motion.div
        className="absolute -top-16 -left-8 w-56 h-56 rounded-full bg-[#3B82F6]/12 blur-3xl -z-10"
        animate={shouldAnimate ? { y: [0, 18, 0], x: [0, 8, 0] } : {}}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute top-12 -right-12 w-64 h-64 rounded-full bg-[#60A5FA]/12 blur-3xl -z-10"
        animate={shouldAnimate ? { y: [0, -22, 0], x: [0, -10, 0] } : {}}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-16 left-1/3 w-48 h-48 rounded-full bg-[#DBEAFE]/55 blur-3xl -z-10"
        animate={shouldAnimate ? { y: [0, 14, 0], scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      {/* Top badge pill */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 16, scale: 0.96 } : false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-white/85 border border-[#DBEAFE]/90 text-[#3B82F6] text-xs font-semibold mb-10 shadow-sm shadow-blue-100/50 backdrop-blur-sm"
      >
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3B82F6]" />
          </span>
          <Sparkles className="w-3 h-3" />
        </span>
        <span>AI Document Understanding &amp; Actionable Workspace</span>
      </motion.div>

      {/* Main headline — word-by-word stagger */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.12]">
        {headlineWords.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={shouldAnimate ? { opacity: 0, y: 24, filter: 'blur(4px)' } : false}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.55,
              delay: 0.05 + i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`inline-block mr-[0.28em] ${
              accentWords.has(word) ? 'text-gradient-blue' : ''
            }`}
            style={accentWords.has(word) ? {
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            } : {}}
          >
            {word}
            {i === 1 && <br className="hidden sm:block" />}
          </motion.span>
        ))}
      </h1>

      {/* Subtitle */}
      <motion.p
        initial={shouldAnimate ? { opacity: 0, y: 14 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
        className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
      >
        Upload complex PDFs, specifications, or screenshots. Powered by{' '}
        <span className="text-slate-800 font-semibold bg-[#EFF6FF] px-1.5 py-0.5 rounded-md border border-[#DBEAFE]/60">
          Gemma 4
        </span>{' '}
        to extract requirements, action items, risks, and verify every claim with{' '}
        <span
          className="font-bold font-mono px-1.5 py-0.5 rounded-md"
          style={{
            background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
            color: '#059669',
            border: '1px solid #a7f3d0',
          }}
        >
          "PROVE IT"
        </span>{' '}
        source evidence.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 14 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
      >
        <motion.button
          onClick={onStartUpload}
          whileHover={shouldAnimate ? { scale: 1.03, y: -2 } : {}}
          whileTap={shouldAnimate ? { scale: 0.97 } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="btn-primary w-full sm:w-auto px-8 py-3.5 flex items-center justify-center space-x-2 text-sm font-semibold"
          id="hero-upload-cta"
        >
          <Zap className="w-4 h-4" aria-hidden="true" />
          <span>Analyze Your Document</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </motion.button>

        <motion.button
          onClick={onTrySample}
          whileHover={shouldAnimate ? { scale: 1.03, y: -2 } : {}}
          whileTap={shouldAnimate ? { scale: 0.97 } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="btn-ghost w-full sm:w-auto px-8 py-3.5 flex items-center justify-center space-x-2 font-medium"
          id="hero-sample-cta"
        >
          <FileCheck className="w-4 h-4 text-[#3B82F6]" aria-hidden="true" />
          <span>Try Sample Hackathon Spec</span>
        </motion.button>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.82, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center gap-8 mb-14"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.85 + i * 0.06, type: 'spring', stiffness: 300, damping: 30 }}
            className="text-center"
          >
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
              {stat.value}
              <span className="text-[#3B82F6]">{stat.suffix}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Feature cards — spring stagger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={shouldAnimate ? { opacity: 0, y: 20, scale: 0.94 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 28,
                delay: 0.9 + i * 0.08,
              }}
              whileHover={shouldAnimate ? { y: -5, rotate: 0.3 } : {}}
              className="group p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/70 cursor-default"
              style={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 10px 40px rgba(59,130,246,0.07)',
                transition: 'box-shadow 0.22s ease, transform 0.22s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(59,130,246,0.14), 0 2px 8px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 10px 40px rgba(59,130,246,0.07)';
              }}
            >
              <motion.div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-3 border border-white/60`}
                whileHover={shouldAnimate ? { scale: 1.1, rotate: 4 } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Icon className={`w-4.5 h-4.5 ${f.iconColor}`} style={{ width: '18px', height: '18px' }} aria-hidden="true" />
              </motion.div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 group-hover:text-[#3B82F6] transition-colors duration-200">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
