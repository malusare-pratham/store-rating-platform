import { useState } from "react";
import { motion } from "framer-motion";

const Star = ({ filled, half, size = 20, interactive, onMouseEnter, onMouseLeave, onClick }) => {
  const fillColor = filled ? "#fbbf24" : half ? "url(#halfGrad)" : "transparent";
  const strokeColor = filled || half ? "#fbbf24" : "#4b5563";

  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor}
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className={interactive ? "cursor-pointer" : ""}
      whileHover={interactive ? { scale: 1.2 } : {}}
      whileTap={interactive ? { scale: 0.9 } : {}}
      onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick}
    >
      <defs>
        <linearGradient id="halfGrad">
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </motion.svg>
  );
};

export const StarDisplay = ({ rating = 0, size = 18, showValue = false }) => {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            filled={rounded >= star}
            half={rounded === star - 0.5}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-mono text-amber-400 ml-1">{rating > 0 ? rating.toFixed(1) : "—"}</span>
      )}
    </div>
  );
};

export const StarInput = ({ value = 0, onChange, size = 28 }) => {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          filled={display >= star}
          interactive
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        />
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-mono text-amber-400">{value}/5</span>
      )}
    </div>
  );
};
