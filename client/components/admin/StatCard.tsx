// components/admin/StatCard.tsx
import React from 'react';
import { LucideProps } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType<LucideProps>; // Lucide icon component
  color?: string;    // e.g., 'text-blue-500'
  bgColor?: string;  // e.g., 'bg-blue-50'
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color = 'text-primary', bgColor = 'bg-primary/10', description }) => {
  return (
    <div className={`p-5 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 ${bgColor} border border-neutral-200`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-medium uppercase tracking-wider ${color}`}>{title}</h3>
        <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
           <Icon size={20} className={color} />
        </div>
      </div>
      <p className="text-3xl font-bold text-textPrimary">{value}</p>
      {description && <p className="text-xs text-textSecondary mt-1">{description}</p>}
    </div>
  );
};

export default StatCard;