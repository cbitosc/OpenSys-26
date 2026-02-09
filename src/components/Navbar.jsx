import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoCOSC from "../assets/LogoCOSC.svg";
import logo4x from "../assets/logo4x.png";

const navLinks = [
  ["Home", "home"],
  ["About", "about"],
  ["Events", "events"],
  ["Gallery", "gallery"],
  ["FAQ", "faq"],
  ["Contact", "contact"],
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const isNavigatingRef = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setActiveId("home");
    }
  }, [location.pathname]);

  const handleNavigation = (target) => {
    handleLinkClick();
    isNavigatingRef.current = true;
    setActiveId(target);

    if (location.pathname !== "/") {
      navigate("/", { replace: true });
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        setTimeout(() => {
          document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 1000);
        }, 50);
      }, 100);
    } else {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    if (location.pathname !== "/") {
      return;
    }

    const sectionIds = navLinks.map(([, target]) => target);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) {
      return;
    }

    const isMobile = window.innerWidth < 768;
    let rafId = 0;
    const ratioMap = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        if (isNavigatingRef.current) {
          return;
        }

        entries.forEach((entry) => {
          ratioMap.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        const sorted = Array.from(ratioMap.entries())
          .filter(([, ratio]) => ratio > 0)
          .sort((a, b) => b[1] - a[1]);

        if (!sorted.length) {
          return;
        }

        const nextId = sorted[0][0];
        
        if (nextId === activeId) {
          return;
        }

        cancelAnimationFrame(rafId);
        if (isMobile) {
          setActiveId(nextId);
        } else {
          rafId = requestAnimationFrame(() => setActiveId(nextId));
        }
      },
      {
        root: null,
        rootMargin: "-100px 0px -40% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [location.pathname, activeId]);

  return (
    <nav
      className="
        fixed top-4 left-4 right-4
        md:left-1/2 md:-translate-x-1/2
        md:w-3/4 md:max-w-4xl
        border border-purple-500/40
        bg-black/70 backdrop-blur-xl md:backdrop-blur-2xl
        rounded-3xl
        z-[100] font-sora
      "
    >
      <div className="flex h-16 md:h-20 items-center justify-between px-4 md:px-6 lg:px-8">

        {/* Logos Container */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 min-w-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("home");
            }}
            aria-label="Go to home"
            className="flex items-center gap-2"
          >
            <img src={logoCOSC} alt="Logo COSC" className="h-8 md:h-10 lg:h-12 w-auto flex-shrink-0" />
            <img src={logo4x} alt="Logo 4x" className="h-8 md:h-10 lg:h-12 w-auto flex-shrink-0" />
          </a>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 lg:gap-8 text-sm lg:text-base text-purple-200 font-medium ml-auto flex-shrink-0">
          {navLinks.map(([label, target]) => (
            <a
              key={target}
              href={`#${target}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(target);
              }}
              className={`nav-link text-purple-200 hover:text-white transition-all duration-300 whitespace-nowrap bg-transparent border-none pb-1 ${
                activeId === target ? "is-active" : ""
              }`}
            >
              <span className="nav-label relative z-10">{label}</span>
            </a>
          ))}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden ml-auto flex-shrink-0 flex flex-col justify-center items-center gap-1.5 w-6 h-6 focus:outline-none"
        >
          <span
            className={`block h-0.5 w-6 bg-[#F9E833] transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-[#F9E833] transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-[#F9E833] transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-purple-500/20 bg-black/80 backdrop-blur-md rounded-b-3xl">
          <div className="flex flex-col gap-0 px-4 py-2">
            {navLinks.map(([label, target]) => (
              <a
                key={target}
                href={`#${target}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNavigation(target);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNavigation(target);
                }}
                className={`nav-link text-purple-200 hover:text-white hover:bg-white/5 active:bg-white/10 px-4 py-3 rounded-lg text-sm transition-all duration-300 relative group block touch-manipulation ${
                  activeId === target ? "is-active" : ""
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span className="nav-label relative z-10">{label}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-400/15 to-transparent opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 rounded-lg -z-10"></span>
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;