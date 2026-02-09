import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 768,
    []
  );
  const reduceMotion = shouldReduceMotion || isMobile;
  const title = 'OpenSys 2026';
  const titleRef = useRef(null);
  const eyebrowText = 'Open Source Symposium';
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const targetDate = useMemo(() => new Date(Date.UTC(2026, 1, 14, 18, 30, 0)), []);
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = Math.max(0, targetDate.getTime() - now.getTime());

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({
        hours: String(hours).padStart(2, '0'),
        days: String(days).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
    if (!titleRef.current) return;
    const letters = titleRef.current.querySelectorAll('.char');
    const isMobile = window.innerWidth < 768;

    gsap.fromTo(
      letters,
      {
        y: isMobile ? 40 : 80,
        opacity: 0,
        rotateX: isMobile ? 0 : 90,
        filter: isMobile ? 'blur(5px)' : 'blur(10px)'
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        filter: 'blur(0px)',
        duration: isMobile ? 0.5 : 0.8,
        ease: 'power4.out',
        stagger: isMobile ? 0.03 : 0.05,
        delay: 0.3
      }
    );
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setTypedText(eyebrowText);
      return;
    }

    const fullText = eyebrowText;
    const typingSpeed = isDeleting ? 30 : 70;
    const pause = 900;

    if (!isDeleting && typedText === fullText) {
      const timeout = setTimeout(() => setIsDeleting(true), pause);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && typedText === '') {
      setIsDeleting(false);
      return;
    }

    const nextText = isDeleting
      ? fullText.slice(0, typedText.length - 1)
      : fullText.slice(0, typedText.length + 1);

    const timeout = setTimeout(() => setTypedText(nextText), typingSpeed);
    return () => clearTimeout(timeout);
  }, [eyebrowText, isDeleting, reduceMotion, typedText]);

  return (
    <section id="home" className="relative min-h-screen w-full">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
          {typedText}
          {!reduceMotion && (
            <span className="ml-1 inline-block h-3 w-0.5 bg-violet-300/70 align-middle animate-pulse" aria-hidden="true" />
          )}
        </p>

        <h1
          ref={titleRef}
          className="mt-3 text-6xl font-semibold tracking-tight md:text-7xl lg:text-8xl text-white"
        >
          {title.split('').map((char, index) => (
            <span key={index} className="char inline-block">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        <div className="mt-8 w-full">
          <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-purple-300">
            Registrations Close In
          </p>
          <div className="mx-auto flex w-full max-w-3xl flex-nowrap justify-between gap-2 sm:justify-center sm:gap-4 md:gap-6">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex h-24 w-20 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-2 py-3 text-center backdrop-blur-sm transition-all duration-300 hover:border-violet-400/40 hover:bg-white/10 sm:h-28 sm:w-24 sm:px-3 sm:py-4 md:h-32 md:w-28 lg:h-36 lg:w-32"
              >
                <div className="relative h-10 w-full flex items-center justify-center overflow-hidden sm:h-12 md:h-14 lg:h-16">
                  {reduceMotion ? (
                    <span className="font-mono text-2xl font-bold text-white tabular-nums sm:text-3xl md:text-4xl lg:text-5xl">
                      {value}
                    </span>
                  ) : (
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.div
                        key={value}
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ y: 60 }}
                        animate={{ y: 0 }}
                        exit={{ y: -60 }}
                        transition={{ 
                          duration: 0.6, 
                          ease: [0.33, 1, 0.68, 1]
                        }}
                      >
                        <span className="font-mono text-2xl font-bold text-white tabular-nums sm:text-3xl md:text-4xl lg:text-5xl">
                          {value}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
                <span className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-gray-400 sm:mt-1.5 sm:text-xs">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 max-w-md text-center text-sm font-semibold tracking-wide text-white/50">
          CBIT, Hyderabad <span className="mx-2 text-white/30">•</span> February 17–18, 2026
        </p>

        <div className="mt-7 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <a
            href="#events"
            className="btn-primary btn-primary-dark w-full px-10 py-3.5 text-center sm:w-auto"
          >
            <span>Register Now</span>
          </a>
          <a
            href="#about"
            className="btn-secondary w-full px-10 py-3.5 text-center sm:w-auto"
          >
            <span>View Schedule</span>
          </a>
        </div>
      </div>
    </section>
  );
}
