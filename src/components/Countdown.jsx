import { useEffect, useState } from "react";

// FlipCard component for each digit
const FlipCard = ({ value, label }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);

      const timer = setTimeout(() => {
        setPrevValue(value);
        setIsFlipping(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <div className="flex flex-col items-center mx-1 sm:mx-2">
      <div className="relative w-14 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 perspective-1000">
        {/* Stationary bottom half showing previous value */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden bg-gradient-to-t from-[#c8b72a]/40 to-[#e0cc2e]/40 border border-[#e0cc2e]/50 rounded-b-lg flex items-start justify-center pt-1 z-10">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#f9e833]/80 drop-shadow-lg">{prevValue}</span>
        </div>

        {/* Top half that flips */}
        <div className={`absolute top-0 left-0 w-full h-1/2 overflow-hidden bg-gradient-to-b from-[#f9e833] to-[#c8b72a] border border-[#e0cc2e]/50 rounded-t-lg flex items-end justify-center pb-1 backface-hidden origin-bottom z-30 ${isFlipping ? 'flipping' : ''}`}
             style={{ transformOrigin: 'bottom' }}>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{value}</span>
        </div>
      </div>
      <div className="mt-2 text-[10px] sm:text-xs md:text-sm uppercase text-[#F9E833] font-medium tracking-wider font-sora">
        {label}
      </div>
    </div>
  );
};

export default function Countdown({ targetDate }) {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();

    if (difference <= 0) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00"
      };
    }

    return {
      days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, "0"),
      hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
      minutes: String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, "0"),
      seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0")
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-8 flex flex-nowrap justify-center gap-2 sm:gap-4 countdown-glow">
      {Object.entries(timeLeft).map(([label, value]) => (
        <FlipCard
          key={label}
          value={value}
          label={label}
        />
      ))}
    </div>
  );
}
