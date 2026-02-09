import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/WillemLoading.css';
import logoCOSC from '../assets/LogoCOSC.svg';
import logoOpenSys from '../assets/logo4x.png';

const WillemLoading = ({ onComplete }) => {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const logo = container.querySelectorAll(".loader-logo");
        const text = container.querySelectorAll(".loader-text");
        const bar = container.querySelectorAll(".loader-bar");

        gsap.set(logo, { scale: 0.92, opacity: 0 });
        gsap.set(text, { y: 8, opacity: 0 });
        gsap.set(bar, { scaleX: 0, transformOrigin: "left" });

        const finish = () => {
            gsap.to(container, {
                autoAlpha: 0,
                duration: 0.2,
                ease: "power2.inOut",
                onComplete: () => {
                    if (onComplete) onComplete();
                }
            });
        };

        const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            onComplete: finish
        });

        tl.to(logo, { opacity: 1, scale: 1, duration: 0.25 })
            .to(text, { opacity: 1, y: 0, duration: 0.2 }, "<+0.03")
            .to(bar, { scaleX: 1, duration: 0.4, ease: "power1.out" }, "<+0.05")
            .to([logo, text], { opacity: 0, y: -6, duration: 0.15 }, ">+0.05");

        return () => {
            tl.kill();
        };
    }, [onComplete]);

    return (
        <section ref={containerRef} className="willem-header is--loading">
            <div className="willem-loader">
                <div className="loader-stack">
                    <div className="loader-logos">
                        <img className="loader-logo" src={logoCOSC} alt="COSC Logo" />
                        <span className="loader-divider" />
                        <img className="loader-logo" src={logoOpenSys} alt="OpenSys Logo" />
                    </div>
                    <p className="loader-text">OpenSys 2026</p>
                    <div className="loader-bar" />
                </div>
            </div>
        </section>
    );
};

export default WillemLoading;
