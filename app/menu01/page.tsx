'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  TrendingUp,
  BookOpen,
  Users,
  Package,
  FileText,
  Settings,
  Wallet,
  ArrowDownToLine,
  ArrowLeftRight,
  ShoppingCart,
  ShoppingBag,
} from 'lucide-react';
import Header from '../custom_components/Header';
import ButtonWithIcon from '../custom_components/ButtonWithIcon';
import Footer from '../custom_components/Footer';

interface PageInfo {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PAGE_DATA: PageInfo[] = [
  { name: 'Daily Stats', path: '/pos/dashboard', icon: BarChart3 },
  { name: 'Key Metrics', path: '/pos/dashboard/dash01', icon: TrendingUp },
  { name: 'Display G/Ls', path: '/pos/gen_ledg/gl_enq', icon: BookOpen },
  { name: 'Display Accounts', path: '/pos/accts/acct_enq', icon: Users },
  { name: 'Display Products', path: '/pos/prods/prod_enq', icon: Package },
  { name: 'Account & G/L Statement', path: '/pos/accts/stmt', icon: FileText },
  { name: 'Product/GL Maintenance', path: '/menu02', icon: Settings },
  { name: 'Pay Cash', path: '/pos/finTran/payCash', icon: Wallet },
  { name: 'Receive Cash', path: '/pos/finTran/rcvCash', icon: ArrowDownToLine },
  { name: 'Account to Account', path: '/pos/finTran/acctToAcct', icon: ArrowLeftRight },
  { name: 'Counter Sales', path: '/pos/sales01', icon: ShoppingCart },
  { name: 'Purchases', path: '/pos/purch01', icon: ShoppingBag },
];

const App: React.FC = () => {
  const router = useRouter();
  const [navigationStatus, setNavigationStatus] = useState('Point of Sale');

  const handleNavigation = (name: string, path: string) => {
    setNavigationStatus(`Navigating to: ${name}`);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 font-sans antialiased">
      <Header />

      {/* Status */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 mt-8">
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-600 text-white font-bold rounded-2xl px-6 py-4 shadow-xl text-center border border-emerald-800">
          <p className="text-lg tracking-wide">{navigationStatus}</p>
        </div>
      </div>

      {/* Buttons Grid */}
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PAGE_DATA.map((page) => (
            <ButtonWithIcon
              key={page.path}
              Icon={page.icon}
              label={page.name}
              onClick={() => handleNavigation(page.name, page.path)}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
