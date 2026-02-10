import { useRef, memo } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  FaDiscord,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import coscLogo from "../assets/LogoCOSC.svg";
import opensysLogo from "../assets/logo4x.png";

const Footer = memo(() => {
  const footerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const disableMotion = prefersReducedMotion || isMobile;
  const inView = useInView(footerRef, { amount: 0.2, once: true });

  return (
    <footer id="contact" className="footer footer-wrapper">
      <motion.div
        ref={footerRef}
        className="footer-inner"
        initial={disableMotion ? false : { opacity: 0, y: 40 }}
        animate={
          disableMotion
            ? { opacity: 1, y: 0 }
            : inView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 40 }
        }
        transition={disableMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
      >
        <div className="footer-grid">
          <div className="footer-column">
            <div className="branding-card">
              <p className="footer-title">About</p>
              <div className="logo-row">
                <img src={coscLogo} alt="COSC Logo" className="logo-cosc" />
                <img src={opensysLogo} alt="OpenSys Logo" className="logo-opensys" />
              </div>
              <div className="branding-text">
                <p className="branding-title">Open Source Symposium</p>
                <p className="branding-subtitle">
                  Organised by CBIT Open Source Community
                </p>
                <p className="branding-subtitle">CBIT, Hyderabad • 2026</p>
              </div>
            </div>
          </div>

          <div className="footer-column resources-column">
            <p className="footer-title">Resources</p>
            <div className="footer-links">
              <a
                href="https://cbit-hacktoberfest25.vercel.app/"
                className="footer-link"
                target="_blank"
                rel="noreferrer"
              >
                Hacktoberfest 2025 page
              </a>
              <a
                href="https://cbitosc.substack.com"
                className="footer-link"
                target="_blank"
                rel="noreferrer"
              >
                COSC Newsletter subscription
              </a>
              <a
                href="https://cbitosc.github.io/"
                className="footer-link"
                target="_blank"
                rel="noreferrer"
              >
                COSC Official Website
              </a>
              <a
                href="https://www.cbit.ac.in"
                className="footer-link"
                target="_blank"
                rel="noreferrer"
              >
                CBIT Official Website
              </a>
            </div>
          </div>

          <div className="footer-column contact-column">
            <p className="footer-title">Contact</p>
            <div className="contact-cards">
              <a className="contact-card" href="mailto:cosc@cbit.ac.in">
                <span className="contact-icon">
                  <FaEnvelope />
                </span>
                <span className="contact-text">cosc@cbit.ac.in</span>
              </a>
              <a className="contact-card" href="tel:+919492532259">
                <span className="contact-icon">
                  <FaPhoneAlt />
                </span>
                <span className="contact-text">
                  Pawan Mohit — +91 9492532259
                </span>
              </a>
              <a className="contact-card" href="tel:+919490050289">
                <span className="contact-icon">
                  <FaPhoneAlt />
                </span>
                <span className="contact-text">
                  Karthekeya — +91 9490050289
                </span>
              </a>
            </div>
          </div>

          <div className="footer-column community-column">
            <p className="footer-title">Community</p>
            <div className="social-list">
              <a
                href="https://www.instagram.com/cbitosc/"
                className="social-link instagram"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <span className="social-icon-wrap">
                  <FaInstagram className="social-icon" />
                </span>
                Instagram
              </a>
              <a
                href="https://github.com/cbitosc"
                className="social-link github"
                aria-label="GitHub"
                target="_blank"
                rel="noreferrer"
              >
                <span className="social-icon-wrap">
                  <FaGithub className="social-icon" />
                </span>
                GitHub
              </a>
              <a
                href="https://discord.com/invite/BCBvtyPsEt"
                className="social-link discord"
                aria-label="Discord"
                target="_blank"
                rel="noreferrer"
              >
                <span className="social-icon-wrap">
                  <FaDiscord className="social-icon" />
                </span>
                Discord
              </a>
              <a
                href="https://linkedin.com/company/cbitosc"
                className="social-link linkedin"
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                <span className="social-icon-wrap">
                  <FaLinkedin className="social-icon" />
                </span>
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        
      </motion.div>
    </footer>
  );
});

export default Footer;
