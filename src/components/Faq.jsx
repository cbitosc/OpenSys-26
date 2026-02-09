import { useState, useRef, useEffect, useMemo, memo } from "react";
import gsap from "gsap";

const Faq = memo(() => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const answerRefs = useRef([]);
  const iconRefs = useRef([]);
  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.innerWidth < 768
    );
  }, []);

  const faqs = [
    {
      question: "Who can participate?",
      answer: "The events are open to anyone with a zeal to learn, collaborate, and compete over open-source technologies. Whether you're a student, professional, or enthusiast, all are welcome!"
    },
    {
      question: "Is this event open to beginners?",
      answer: "Absolutely! Whether you're a beginner, professional, or simply someone who is passionate about open-source software, there's something for everyone at OpenSys. We provide resources and support for all skill levels."
    },
    {
      question: "Is there any registration fee?",
      answer: "No, the events are completely free to participate in. We believe in making technology accessible to everyone regardless of financial constraints."
    },
    {
      question: "When do the events begin?",
      answer: "The events take place over two exciting days, on February 17th and February 18th, 2026. Mark your calendars and get ready for an amazing experience!"
    },
    {
      question: "What types of events are included?",
      answer: "OpenSys features a diverse range of events including GIT Arcana (an innovative GitHub repository exploration challenge), Decipher (a dynamic decryption challenge), and Odyssey (a thrilling two-day puzzle-solving adventure)."
    },
    {
      question: "How do I register for events?",
      answer: "Simply browse our events section, click on the event you're interested in, and click the 'Register Now' button. Fill out the required information and you're all set!"
    },
    {
      question: "Will there be prizes for winners?",
      answer: "Yes! Each event offers exciting prizes including cash rewards, tech gadgets, certificates, and networking opportunities with industry professionals."
    },
    {
      question: "Can I participate in multiple events?",
      answer: "Yes, you can register for and participate in multiple events as long as the schedules don't overlap. We encourage participants to explore different challenges!"
    }
  ];

  const toggleFaq = (index) => {
    const current = expandedIndex;

    if (current !== null && current !== index) {
      const closingAnswer = answerRefs.current[current];
      const closingIcon = iconRefs.current[current];

      if (reduceMotion) {
        if (closingAnswer) {
          closingAnswer.style.height = "0px";
          closingAnswer.style.opacity = "0";
        }
        if (closingIcon) {
          closingIcon.style.transform = "rotate(0deg)";
        }
      } else {
        gsap.to(closingAnswer, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut"
        });

        gsap.to(closingIcon, {
          rotation: 0,
          duration: 0.3,
          ease: "power2.inOut"
        });
      }
    }

    const answer = answerRefs.current[index];
    const icon = iconRefs.current[index];

    if (expandedIndex === index) {
      if (reduceMotion) {
        if (answer) {
          answer.style.height = "0px";
          answer.style.opacity = "0";
        }
        if (icon) {
          icon.style.transform = "rotate(0deg)";
        }
      } else {
        gsap.to(answer, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut"
        });

        gsap.to(icon, {
          rotation: 0,
          duration: 0.3,
          ease: "power2.inOut"
        });
      }

      setExpandedIndex(null);
    } else {
      if (reduceMotion) {
        if (answer) {
          answer.style.height = "auto";
          answer.style.opacity = "1";
        }
        if (icon) {
          icon.style.transform = "rotate(180deg)";
        }
      } else {
        answer.style.height = "auto";
        const height = answer.scrollHeight;
        answer.style.height = "0px";

        gsap.to(answer, {
          height,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            answer.style.height = "auto";
          }
        });

        gsap.to(icon, {
          rotation: 180,
          duration: 0.3,
          ease: "power2.inOut"
        });
      }

      setExpandedIndex(index);
    }
  };

  useEffect(() => {
    answerRefs.current.forEach((answer) => {
      if (answer) {
        answer.style.height = "0px";
        answer.style.opacity = "0";
        answer.style.overflow = "hidden";
        answer.style.width = "100%";
      }
    });
  }, []);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">

        <h2 className="text-center text-4xl md:text-5xl font-bold text-white mb-3">
          Frequently Asked Questions
        </h2>

        <p className="text-center text-purple-200 mb-14 font-medium">
          Everything you need to know about OpenSys
        </p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-black/40 backdrop-blur-sm md:backdrop-blur-xl rounded-2xl border border-purple-900 overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className={`w-full text-left p-6 flex items-start justify-between gap-4
                  ${expandedIndex === index ? "bg-purple-900/20" : "hover:bg-purple-900/10"}
                `}
              >
                <span className="text-lg font-semibold text-white">
                  {faq.question}
                </span>

                <span
                  ref={(el) => (iconRefs.current[index] = el)}
                  className="flex-shrink-0 w-6 h-6 text-purple-300"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              <div
                ref={(el) => (answerRefs.current[index] = el)}
                className="w-full overflow-hidden border-t border-purple-900/50 bg-black/20"
              >
                <p className="text-gray-300 p-6">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
});

export default Faq;
