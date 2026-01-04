'use client';

import React from 'react';
import { Leaf } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          
          {/* Logo + Title */}
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              POS
            </h1>
          </div>

          {/* Status */}
          <div className="hidden sm:flex items-center space-x-2 px-5 py-2.5 bg-emerald-100 rounded-full border border-emerald-200">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-emerald-700">
              System Active
            </span>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
