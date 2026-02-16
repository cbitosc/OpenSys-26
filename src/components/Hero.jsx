import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
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
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-blue-500/5 px-6 py-6 backdrop-blur-sm">
            <span className="mb-2 text-3xl"></span>
            <p className="text-lg font-bold uppercase tracking-wider text-red-400 sm:text-xl">
              Registrations Closed
            </p>
            <p className="mt-2 text-sm text-white/50">
              Thank you for your interest! See you at the event.
            </p>
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
            <span>View About Events</span>
          </a>
          
        </div>
      </div>
    </section>
  );
}
