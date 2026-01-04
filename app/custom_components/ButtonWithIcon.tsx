'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonWithIconProps {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}

const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
  Icon,
  label,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white font-semibold py-5 px-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-1 active:scale-95 flex items-center justify-between w-full"
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

      {/* Icon + Label */}
      <div className="flex items-center space-x-1 ">
        <div className="p-2.5 bg-white/20 rounded-xl group-hover:bg-white/30 group-hover:rotate-6 transition-all duration-300">
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-base font-semibold">{label}</span>
      </div>

      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 z-10" />
    </button>
  );
};

export default ButtonWithIcon;
