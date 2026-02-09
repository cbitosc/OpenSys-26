import { useState, memo, useCallback, useEffect, useMemo, useRef } from "react";
import img1 from "../assets/IMG_0089.jpg";
import img2 from "../assets/IMG_0092.jpg";
import img3 from "../assets/IMG_0097.jpg";
import img4 from "../assets/IMG_0113.jpg";
import img5 from "../assets/IMG_0100.jpg";
import img6 from "../assets/IMG_0102.jpg";
import img7 from "../assets/IMG_0104.jpg";
import img8 from "../assets/IMG_0098.jpg";
import img9 from "../assets/IMG_0117.jpg";
import img10 from "../assets/IMG_0123.jpg";
import img11 from "../assets/IMG_0131.jpg";

const images1 = [img1, img2, img3, img4, img5, img6];
const images2 = [img7, img8, img9, img10, img11];

const Gallery = memo(() => {
  const [hovered1, setHovered1] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const [touched1, setTouched1] = useState(false);
  const [touched2, setTouched2] = useState(false);
  const [inView1, setInView1] = useState(true);
  const [inView2, setInView2] = useState(true);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 768,
    []
  );

  const handleTouchStart1 = useCallback(() => setTouched1(true), []);
  const handleTouchEnd1 = useCallback(() => setTouched1(false), []);

  const handleTouchStart2 = useCallback(() => setTouched2(true), []);
  const handleTouchEnd2 = useCallback(() => setTouched2(false), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    if (!row1 && !row2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === row1) {
            setInView1(entry.isIntersecting);
          } else if (entry.target === row2) {
            setInView2(entry.isIntersecting);
          }
        });
      },
      { root: null, threshold: 0.1 }
    );

    if (row1) observer.observe(row1);
    if (row2) observer.observe(row2);

    return () => observer.disconnect();
  }, []);

  const pauseRow1 = hovered1 || touched1 || !inView1;
  const pauseRow2 = hovered2 || touched2 || !inView2;

  return (
    <>
      <section className="relative overflow-hidden py-16 md:py-20">
        <style>{`
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scrollRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .scroll-paused {
            animation-play-state: paused !important;
          }
        `}</style>
        <div className="w-screen overflow-hidden mx-auto px-6">
          <h2 className="text-center text-4xl md:text-5xl font-bold text-white mb-3">
            Gallery
          </h2>
          <p className="text-center text-purple-200 mb-14 font-medium">
            Relive moments from previous editions of OpenSys
          </p>
          <div
            className="overflow-hidden mb-10"
            onMouseEnter={() => setHovered1(true)}
            onMouseLeave={() => setHovered1(false)}
            onTouchStart={handleTouchStart1}
            onTouchEnd={handleTouchEnd1}
          >
            <div
              ref={row1Ref}
              className={`flex gap-6 w-max ${pauseRow1 ? "scroll-paused" : ""}`}
              style={{ animation: isMobile ? "scrollLeft 50s linear infinite" : "scrollLeft 35s linear infinite" }}
            >
              {[...images1, ...images1].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="gallery"
                  loading="lazy"
                  decoding="async"
                  className="
                    w-56 h-36
                    sm:w-64 sm:h-40
                    md:w-80 md:h-52
                    lg:w-90 lg:h-60
                    object-cover
                    rounded-2xl
                    shadow-none sm:shadow-lg md:shadow-xl
                    border border-purple-400/80 sm:border-2 sm:border-purple-400
                  "
                />
              ))}
            </div>
          </div>
        </div>
        <div
          className="overflow-hidden mt-6"
          onMouseEnter={() => setHovered2(true)}
          onMouseLeave={() => setHovered2(false)}
          onTouchStart={handleTouchStart2}
          onTouchEnd={handleTouchEnd2}
        >
          <div
            ref={row2Ref}
            className={`flex gap-6 w-max ${pauseRow2 ? "scroll-paused" : ""}`}
            style={{ animation: isMobile ? "scrollRight 50s linear infinite" : "scrollRight 35s linear infinite" }}
          >
            {[...images2, ...images2].map((src, i) => (
              <img
                key={i}
                src={src}
                alt="gallery"
                loading="lazy"
                decoding="async"
                className="
                  w-56 h-36
                  sm:w-64 sm:h-40
                  md:w-80 md:h-52
                  lg:w-90 lg:h-60
                  object-cover
                  rounded-2xl
                  shadow-none sm:shadow-lg md:shadow-xl
                  border border-purple-400/80 sm:border-2 sm:border-purple-400
                "

              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
});

export default Gallery;