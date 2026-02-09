import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mail, User, Phone, GraduationCap, Calendar, Hash, Key, ChevronDown } from 'lucide-react';

const Input = React.memo(({
  icon: Icon,
  participant,
  field,
  label,
  type = "text",
  value,
  onChange,
  formData,
  options,
  error,
  isCheckbox = false,
  required = false,
  staticLabel = false,
  uiVariant = "default",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 768,
    []
  );
  const reduceMotion = prefersReducedMotion || isMobile;

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);
  }, []);

  const hasValue = value && value.length > 0;
  const isSelect = Boolean(options);
  const useStaticLabel = staticLabel || isSelect;
  const selectPlaceholder = `Select ${label}`;
  const isPremium = uiVariant === "premium";
  const showFocus = isFocused || isOpen;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="group relative space-y-2">
      {isCheckbox ? (
        <div className="flex flex-col space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm md:backdrop-blur-md">
           <span className="text-sm font-medium text-violet-300/70 ml-1 uppercase tracking-widest">{label}</span>
           <div className="flex flex-wrap gap-4">
            {options.map((option) => (
              <label key={option} className="relative flex items-center cursor-pointer group/item">
                <input
                  type="radio"
                  checked={value === option}
                  onChange={() => participant !== undefined ? onChange(participant, field, option) : onChange(field, option)}
                  className="peer sr-only"
                  name={participant ? `${participant}-${field}` : field}
                />
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white transition-all duration-300 
                  peer-checked:bg-violet-500/20 peer-checked:border-violet-400 peer-checked:shadow-[0_0_15px_rgba(167,139,250,0.3)]
                  group-hover/item:bg-white/10">
                  {option}
                </div>
              </label>
            ))}
          </div>
        </div>
      ) : (
        <div className={`relative ${useStaticLabel ? "" : "pt-4"}`}>
          {useStaticLabel ? (
            <label className={`mb-2 ml-1 block text-[11px] font-semibold uppercase tracking-widest ${isPremium ? "text-violet-300/80" : "text-violet-300/70"}`}>
              {label}
            </label>
          ) : (
            <label className={`absolute left-10 transition-all duration-300 pointer-events-none
              ${(isFocused || hasValue) ? '-top-1 text-xs text-violet-400 font-bold tracking-wider' : 'top-7 text-gray-400 text-base'}`}>
              {label.toUpperCase()}
            </label>
          )}

          {/* Input Aura Glow */}
          <div className="absolute inset-0 rounded-xl transition-opacity duration-500 blur-xl opacity-0" />

          <div className="relative flex items-center">
            {Icon && (
              <div className="absolute left-3 flex items-center pointer-events-none transition-colors duration-300">
                <Icon className={`h-5 w-5 ${isFocused ? 'text-violet-400' : error ? 'text-red-400' : 'text-violet-200/50'}`} />
              </div>
            )}

            {options ? (
              <div ref={selectRef} className="relative w-full">
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen((prev) => !prev)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    if (!isOpen) {
                      setIsFocused(false);
                    }
                  }}
                  className={`flex w-full items-center justify-between pl-10 pr-10 ${isPremium ? 'py-3' : 'py-3.5'} border transition-all duration-300 text-base
                    ${error ? 'border-red-500/50 bg-red-500/5' : showFocus ? 'border-violet-400/70 ring-2 ring-violet-400/20 bg-white/[0.06]' : isPremium ? 'border-white/10 bg-white/[0.04]' : 'border-white/10 bg-white/[0.03]'}
                    rounded-xl text-left text-white/90 focus:outline-none backdrop-blur-sm md:backdrop-blur-xl hover:bg-white/5`}
                >
                  <span className={value ? 'text-white/90' : 'text-white/50'}>
                    {value || selectPlaceholder}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-violet-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0, y: 0 } : { opacity: 0, y: 6 }}
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
                      className="absolute z-20 mt-2 w-full rounded-xl border border-white/10 bg-[#0b0716]/95 backdrop-blur-sm md:backdrop-blur-xl shadow-lg md:shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
                    >
                      <ul role="listbox" className="max-h-60 overflow-auto py-2">
                        <li>
                          <button
                            type="button"
                            onClick={() => {
                              participant !== undefined ? onChange(participant, field, '') : onChange(field, '');
                              setIsOpen(false);
                              setIsFocused(false);
                            }}
                            className="flex w-full items-center px-4 py-2 text-left text-sm text-white/50 hover:bg-white/5"
                          >
                            {selectPlaceholder}
                          </button>
                        </li>
                        {options.map((option) => (
                          <li key={option}>
                            <button
                              type="button"
                              onClick={() => {
                                participant !== undefined ? onChange(participant, field, option) : onChange(field, option);
                                setIsOpen(false);
                                setIsFocused(false);
                              }}
                              className={`flex w-full items-center px-4 py-2 text-left text-sm transition-colors
                                ${value === option ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5'}`}
                            >
                              {option}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <input
                type={type === 'tel' || field === 'phone' ? 'tel' : type}
                value={value}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => {
                  const val = field === 'phone' ? e.target.value.replace(/\D/g, '') : e.target.value;
                  participant !== undefined ? onChange(participant, field, val) : onChange(field, val);
                }}
                className={`block w-full pl-10 pr-4 ${isPremium ? 'py-3' : 'py-4'} border transition-all duration-300
                  ${error ? 'border-red-500/50 bg-red-500/5' : isFocused ? 'border-violet-400/70 ring-2 ring-violet-400/25' : isPremium ? 'border-white/10 bg-white/[0.04]' : 'border-white/10 bg-white/[0.03]'}
                  rounded-xl text-white focus:outline-none backdrop-blur-sm md:backdrop-blur-xl hover:bg-white/5 placeholder:text-white/30`}
                style={isIOS ? { fontSize: '16px' } : {}}
                required={required}
                maxLength={field === 'phone' ? 10 : undefined}
                {...props}
              />
            )}
          </div>
        </div>
      )}

      {/* Sexy transition for "Other College" field */}
      <AnimatePresence initial={false}>
        {field === 'college' && value === 'Other' && (
          <motion.div 
            initial={reduceMotion ? false : { opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={reduceMotion ? { opacity: 0, y: 0, height: 0 } : { opacity: 0, y: -10, height: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3">
              <input
                type="text"
                value={formData?.otherCollegeName || ''}
                onChange={(e) => participant !== undefined ? onChange(participant, 'otherCollegeName', e.target.value) : onChange('otherCollegeName', e.target.value)}
                className={`block w-full border transition-all duration-300 text-base
                  ${error ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/[0.04]'}
                  rounded-xl py-3 pl-10 pr-4 text-white/90 focus:outline-none focus:ring-2 focus:ring-violet-400/20 focus:border-violet-400/70 backdrop-blur-sm md:backdrop-blur-xl placeholder:text-white/40`}
                placeholder="Type your college name..."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p 
          initial={reduceMotion ? false : { opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
          className="text-red-400 text-[11px] uppercase font-bold tracking-tighter pl-2 italic"
        >
          ! {error}
        </motion.p>
      )}
    </div>
  );
});

export default Input;