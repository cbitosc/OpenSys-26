import { useState } from 'react';

const Button = ({ 
  children, 
  href, 
  variant = 'primary', 
  className = '', 
  onClick,
  ...props 
}) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  const baseStyles = "relative px-8 py-3.5 text-center overflow-hidden touch-manipulation";
  
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "text-purple-200 hover:bg-white/10"
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
        />
      ))}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={combinedClassName}
        onClick={handleClick}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={combinedClassName}
      onClick={handleClick}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
