"use client";

export default function ColorfulDashboard() {
  // Define data with a category for dynamic styling
  type ColorCategory = "emerald" | "green" | "teal" | "lime";

  interface CardData {
    id: number;
    title: string;
    figure: string;
    category: ColorCategory;
    icon: string;
    trend: string;
  }

  const cardData: CardData[] = [
    { id: 1, title: "Total Sales", figure: "$15,000", category: "emerald", icon: "💰", trend: "+12.5%" },
    { id: 2, title: "New Users", figure: "1,200", category: "green", icon: "👤", trend: "+8.3%" },
    { id: 3, title: "Revenue", figure: "$45k", category: "teal", icon: "📈", trend: "+15.2%" },
    { id: 4, title: "Avg. Order Value", figure: "$150", category: "lime", icon: "🛒", trend: "+5.7%" },
    { id: 5, title: "Pending Orders", figure: "45", category: "emerald", icon: "⏳", trend: "-2.1%" },
    { id: 6, title: "Support Tickets", figure: "12", category: "green", icon: "💬", trend: "-4.3%" },
    { id: 7, title: "Conversion Rate", figure: "3.5%", category: "teal", icon: "🔥", trend: "+1.8%" },
    { id: 8, title: "Page Views", figure: "88k", category: "lime", icon: "👀", trend: "+22.4%" },
  ];

  // Map categories to Tailwind color classes
  const colorMap: Record<
    ColorCategory,
    { bg: string; border: string; text: string; fig: string; dot: string; hover: string }
  > = {
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-500",
      text: "text-emerald-800",
      fig: "text-emerald-600",
      dot: "bg-emerald-500",
      hover: "hover:bg-emerald-100",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-500",
      text: "text-green-800",
      fig: "text-green-600",
      dot: "bg-green-500",
      hover: "hover:bg-green-100",
    },
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-500",
      text: "text-teal-800",
      fig: "text-teal-600",
      dot: "bg-teal-500",
      hover: "hover:bg-teal-100",
    },
    lime: {
      bg: "bg-lime-50",
      border: "border-lime-500",
      text: "text-lime-800",
      fig: "text-lime-600",
      dot: "bg-lime-500",
      hover: "hover:bg-lime-100",
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-8">
      {/* Beautiful Green Banner */}
      <header className="mb-8 rounded-2xl shadow-2xl overflow-hidden">
        <div
          className="p-8 text-center relative"
          style={{
            background:
              "linear-gradient(135deg, #10b981 0%, #059669 25%, #047857 50%, #065f46 75%, #064e3b 100%)",
          }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <span className="text-6xl">🌿</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
              Sales Dashboard
            </h1>
            <p className="text-green-100 text-lg font-medium">Your vibrant performance snapshot at a glance</p>

            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-1 w-16 bg-green-300 rounded-full"></div>
              <div className="h-1 w-8 bg-green-400 rounded-full"></div>
              <div className="h-1 w-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Sub-header quick stats */}
        <div className="bg-white border-t-4 border-green-500 p-4">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">98.5%</p>
              <p className="text-xs text-gray-600 font-medium">Uptime</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">2,450</p>
              <p className="text-xs text-gray-600 font-medium">Active Users</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-600">$125k</p>
              <p className="text-xs text-gray-600 font-medium">Monthly Revenue</p>
            </div>
          </div>
        </div>
      </header>

      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-800 flex items-center gap-2">
          <span className="text-3xl">📊</span> Key Metrics
        </h2>
        <p className="text-gray-600 text-sm mt-1">Real-time business performance indicators</p>
      </div>

      {/* Card Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cardData.map((card) => {
          const colors = colorMap[card.category];
          const isPositive = card.trend.startsWith("+");

          return (
            <div
              key={card.id}
              className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 ${colors.bg} ${colors.hover} ${colors.border} border-l-4 relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-20 h-20 ${colors.dot} opacity-10 rounded-full -mr-10 -mt-10`}></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{card.icon}</span>
                    <div className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`}></div>
                  </div>
                </div>

                <p className={`text-sm font-bold ${colors.text} mb-2 uppercase tracking-wide`}>{card.title}</p>

                <p className={`text-4xl font-extrabold ${colors.fig} mb-2`}>{card.figure}</p>

                <div className="flex items-center gap-1">
                  <span className={`text-xs font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    {isPositive ? "↗" : "↘"} {card.trend}
                  </span>
                  <span className={`text-xs ${colors.text} opacity-75`}>since last week</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md border-2 border-green-200">
          <span className="text-green-600 font-semibold">🌱 Growing Strong</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600 text-sm">Last updated: Just now</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
