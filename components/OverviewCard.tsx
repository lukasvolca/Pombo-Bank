
import React from 'react';

interface OverviewCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110">
        {React.cloneElement(icon as React.ReactElement, { size: 100 })}
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50">
          {icon}
        </div>
        <span className="text-slate-400 font-medium">{title}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-slate-500 text-sm">R$</span>
        <span className={`text-2xl md:text-3xl font-bold ${color}`}>
          {value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};

export default OverviewCard;
