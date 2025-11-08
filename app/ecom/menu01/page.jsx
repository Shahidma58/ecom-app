'use client'
import React, { useState } from 'react';
import { Leaf, PanelTop, ArrowRight } from 'lucide-react';
import { useRouter } from "next/navigation";

// Define the single, comprehensive Tailwind class for all 12 buttons.
const GREEN_BUTTON_STYLE =
  'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl ' +
  'shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.02] ' +
  'flex items-center justify-center space-x-2 w-full text-lg';

// Define the names and explicit paths for the 12 mock pages as an array of objects.
const PAGE_DATA = [
  { name: "Dashboard", path: "/ecom/finTran/payCash" },
  { name: "Analytics", path: "/analytics" },
  { name: "Reports", path: "/reports" },
  { name: "Settings", path: "/settings" },
  { name: "Users", path: "/users" },
  { name: "Products", path: "/products" },
  { name: "Invoices", path: "/invoices" },
  { name: "Support", path: "/support" },
  { name: "Projects", path: "/projects" },
  { name: "Calendar", path: "/calendar" },
  { name: "Tasks", path: "/tasks" },
  { name: "Finance", path: "/finance" }
];

const App = () => {
  const router = useRouter();
  const [navigationStatus, setNavigationStatus] = useState("Ready to navigate!");

  // Function to handle the navigation event using the explicit path
  const handleNavigation = (name, path) => {
    // In a real Next.js app, you would use: useRouter().push(path);
    console.log(`Navigating to: ${path}`);
//    setNavigationStatus(`Mapsd to: ${name} (${path})`);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased flex flex-col items-center p-4 sm:p-8">
      
      {/* Top Banner Section */}
      <header className="w-full max-w-4xl mb-12 bg-emerald-50 border-b-4 border-emerald-600 rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 text-emerald-800">
          <PanelTop className="w-8 h-8" />
          <h1 className="text-3xl font-bold tracking-tight">Green Shade Command Center</h1>
        </div>
        <p className="mt-2 text-emerald-600">
          Select a module below to begin. All buttons share the same single Tailwind class for consistent styling.
        </p>
      </header>

      {/* Navigation Status Message */}
      <div className="w-full max-w-4xl text-center mb-8 p-3 bg-emerald-100 text-emerald-800 font-medium rounded-lg">
        {navigationStatus}
      </div>

      {/* Centered Button Grid */}
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {PAGE_DATA.map((page, index) => (
            <button
              key={index}
              className={GREEN_BUTTON_STYLE} // Applying the single defined class
              onClick={() => handleNavigation(page.name, page.path)}
            >
              <Leaf className="w-5 h-5" />
              <span>{page.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default App;
