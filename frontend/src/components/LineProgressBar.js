import React from 'react';

const LineProgressBar = ({ label, percentage, lineColor }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-white">{label}</span>
        <span className="metric-number text-[var(--color-text-muted)]">{percentage}%</span>
      </div>
      <div className="h-3 rounded-[9999px] bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-[9999px]"
          role="progressbar"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${lineColor}, #00ffb2)`,
            boxShadow: `0 0 18px ${lineColor}`,
            transition: "width 1s ease-in-out",
          }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

export default LineProgressBar;
