import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const rafRef = useRef(null);
  const targetRef = useRef({ x: -100, y: -100 });
  const rafPendingRef = useRef(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    document.body.classList.add('has-custom-cursor');

    const update = () => {
      rafPendingRef.current = false;
      const target = targetRef.current;
      cursor.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
    };

    const handleMove = (e) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      if (!rafPendingRef.current) {
        rafPendingRef.current = true;
        rafRef.current = requestAnimationFrame(update);
      }
    };

    document.addEventListener('mousemove', handleMove, { passive: true });

    return () => {
      document.body.classList.remove('has-custom-cursor');
      document.removeEventListener('mousemove', handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '44px',
        height: '44px',
        pointerEvents: 'none',
        zIndex: 9999999,
        transform: 'translate3d(-100px, -100px, 0)',
        willChange: 'transform'
      }}
    >
      <svg
        width="44"
        height="44"
        viewBox="0 0 48 48"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M12 8 Q10 8 10 10 L10 38 Q10 40 12 40 L38 26 Q40 25 38 22 Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default CustomCursor;
