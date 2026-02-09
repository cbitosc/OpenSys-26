import { useEffect, useRef, memo } from "react";

const BeautifulBackground = memo(() => {
  const canvasRef = useRef(null);
  const vignetteRef = useRef(null);
  const noiseRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    let animFrame;
    let nodes = [];
    let tick = 0;
    let lastFrameTime = 0;
    let logicalWidth = window.innerWidth;
    let logicalHeight = window.innerHeight;

    const getConfig = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      return {
        particleCount: isMobile ? 26 : isTablet ? 30 : 70,
        linkDistance: isMobile ? 150 : isTablet ? 120 : 160,
        trailFade: isMobile ? 0.22 : 0.15,
        speed: isMobile ? 0.35 : isTablet ? 0.4 : 0.6,
        fps: isMobile ? 36 : 60,
        simpleDraw: isMobile,
        linkOpacityScale: isMobile ? 0.95 : 0.4,
        colors: [
          "138, 43, 226",
          "255, 20, 147",
          "147, 51, 234",
          "236, 72, 153",
          "168, 85, 247",
          "219, 39, 119",
        ],
      };
    };

    let config = getConfig();

    class Node {
      constructor() {
        this.reset();
        this.phase = Math.random() * Math.PI * 2;
      }

      reset() {
        this.x = Math.random() * logicalWidth;
        this.y = Math.random() * logicalHeight;
        this.vx = (Math.random() - 0.5) * config.speed;
        this.vy = (Math.random() - 0.5) * config.speed;
        this.size = Math.random() * 1.5 + 1;
        this.rgb = config.colors[Math.floor(Math.random() * config.colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > logicalWidth) this.vx *= -1;
        if (this.y < 0 || this.y > logicalHeight) this.vy *= -1;
      }

      draw() {
        if (config.simpleDraw) {
          const pulse = Math.sin(tick * 0.03 + this.phase) * 0.2 + 1;
          ctx.fillStyle = `rgba(${this.rgb}, 0.6)`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * pulse * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const pulse = Math.sin(tick * 0.03 + this.phase) * 0.3 + 1;
          const gradient = ctx.createRadialGradient(
            this.x,
            this.y,
            0,
            this.x,
            this.y,
            this.size * pulse * 3
          );
          gradient.addColorStop(0, `rgba(${this.rgb}, 0.8)`);
          gradient.addColorStop(0.5, `rgba(${this.rgb}, 0.3)`);
          gradient.addColorStop(1, `rgba(${this.rgb}, 0)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * pulse * 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(${this.rgb}, 0.9)`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * pulse * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const init = () => {
      nodes = Array.from({ length: config.particleCount }, () => new Node());
    };

    const applyVisualTuning = (isMobile) => {
      if (canvas) {
        canvas.style.opacity = isMobile ? "0.7" : "0.85";
        canvas.style.filter = isMobile
          ? "blur(0.3px) contrast(1.05) saturate(1.05)"
          : "blur(0.4px) contrast(1.1) saturate(1.1)";
      }

      if (vignetteRef.current) {
        vignetteRef.current.style.opacity = isMobile ? "0.75" : "1";
      }

      if (noiseRef.current) {
        noiseRef.current.style.opacity = isMobile ? "0.02" : "0.03";
      }
    };

    const resize = () => {
      const isMobile = window.innerWidth < 768;
      const dprCap = isMobile ? 1.5 : 2;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const { innerWidth: w, innerHeight: h } = window;
      logicalWidth = w;
      logicalHeight = h;

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      config = getConfig();
      init();
      applyVisualTuning(isMobile);
    };

    const drawNeuralLinks = () => {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < config.linkDistance) {
            const opacity = (1 - dist / config.linkDistance) * config.linkOpacityScale;
            ctx.strokeStyle = `rgba(${n1.rgb}, ${opacity})`;
            ctx.lineWidth = opacity * 2;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            if (config.simpleDraw) {
              ctx.lineTo(n2.x, n2.y);
            } else {
              const midX = (n1.x + n2.x) / 2;
              const midY = (n1.y + n2.y) / 2;
              const wave = Math.sin(tick * 0.01 + i) * 3;
              ctx.quadraticCurveTo(midX + wave, midY + wave, n2.x, n2.y);
            }
            ctx.stroke();
          }
        }
      }
    };

    const loop = (currentTime) => {
      const frameInterval = 1000 / config.fps;
      if (currentTime - lastFrameTime < frameInterval - 1) {
        animFrame = requestAnimationFrame(loop);
        return;
      }
      lastFrameTime = currentTime;

      ctx.fillStyle = `rgba(5, 1, 10, ${config.trailFade})`;
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);
      drawNeuralLinks();
      nodes.forEach((node) => {
        node.update();
        node.draw();
      });
      tick++;
      animFrame = requestAnimationFrame(loop);
    };

    let resizeTimeout;
    const throttledResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 250);
    };

    window.addEventListener("resize", throttledResize, { passive: true });
    resize();
    loop(0);

    return () => {
      window.removeEventListener("resize", throttledResize);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{ backgroundColor: "#05010a" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          mixBlendMode: "screen",
          filter: "blur(0.4px) contrast(1.1) saturate(1.1)",
          opacity: 0.85,
        }}
      />
      <div
        ref={vignetteRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(5, 1, 10, 0.7) 80%, #000 100%)",
          zIndex: 10,
        }}
      />
      <div
        ref={noiseRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          zIndex: 20,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
});

export default BeautifulBackground;
