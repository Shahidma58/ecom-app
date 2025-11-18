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

  // Map categories to vibrant Tailwind color classes with colored backgrounds
  const colorMap: Record<
    ColorCategory,
    // { bg: string; border: string; text: string; fig: string; dot: string; hover: string }
    { bg: string; border: string; text: string; fig: string; hover: string }
  > = {
    emerald: {
      bg: "bg-yellow-500",
      border: "border-yellow-600",
      text: "text-white",
      fig: "text-white",
//      dot: "bg-yellow-700",
      hover: "hover:bg-yellow-400",
    },
    green: {
      bg: "bg-green-700",
      border: "border-green-600",
      text: "text-white",
      fig: "text-white",
//      dot: "bg-green-700",
      hover: "hover:bg-green-600",
    },
    teal: {
      bg: "bg-teal-500",
      border: "border-teal-600",
      text: "text-white",
      fig: "text-white",
//      dot: "bg-teal-700",
      hover: "hover:bg-teal-600",
    },
    lime: {
      bg: "bg-red-700",
      border: "border-black-600",
      text: "text-white",
      fig: "text-white",
//      dot: "bg-red-900",
      hover: "hover:bg-red-400",
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 via-green-50 to-emerald-50 p-4 sm:p-8">
      {/* Compact Smart Banner - Max 100px */}
      <header className="mb-8 rounded-xl shadow-lg overflow-hidden max-h-[100px]">
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{
            background: "linear-gradient(90deg, #10b981 0%, #059669 50%, #047857 100%)",
          }}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">🌿</span>
            <div>
              <h1 className="text-2xl font-bold text-white">AmieMe - Key Metrics</h1>
              <p className="text-green-100 text-sm">Real-time performance</p>
            </div>
          </div>

          {/* Quick Stats in Header */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-center">
              <p className="text-xl font-bold text-white">98.5%</p>
              <p className="text-xs text-green-100">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">2,450</p>
              <p className="text-xs text-green-100">Users</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">$125k</p>
              <p className="text-xs text-green-100">Revenue</p>
            </div>
          </div>
        </div>
      </header>

      {/* Section Title */}
      {/* <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-3xl">📊</span> Key Metrics
        </h2>
        <p className="text-gray-600 text-sm mt-1">Real-time business performance indicators</p>
      </div> */}

      {/* Card Grid - Colorful Backgrounds */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {cardData.map((card) => {
          const colors = colorMap[card.category];
          const isPositive = card.trend.startsWith("+");

          return (
            <div
              key={card.id}
              className={`p-3 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 ${colors.bg} ${colors.hover} border-l-4 ${colors.border} relative overflow-hidden`}
            >
              {/* Decorative element */}
              {/* <div className={`absolute top-0 right-0 w-24 h-24 ${colors.dot} opacity-20 rounded-full -mr-12 -mt-12`}></div> */}

              <div className="relative z-10">
                {/* Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl drop-shadow-lg">{card.icon}</span>
                  <div className={`w-3 h-3 rounded-full ${colors.fig} animate-pulse`}></div>
                </div>

                {/* Title */}
                <p className={`text-sm font-bold ${colors.text} mb-1 uppercase tracking-wide opacity-90`}>
                  {card.title}
                </p>

                {/* Main Figure */}
                <p className={`text-4xl font-extrabold ${colors.fig} mb-3 drop-shadow-sm`}>
                  {card.figure}
                </p>

                {/* Trend Indicator with better contrast */}
                {/* <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-3 py-1.5">
                  <span className={`text-sm font-bold ${isPositive ? "text-green-900" : "text-red-900"}`}>
                    {isPositive ? "↗" : "↘"} {card.trend}
                  </span>
                  <span className={`text-xs ${colors.text} opacity-75`}>vs last week</span>
                </div> */}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border-2 border-green-300">
          <span className="text-red-600 font-semibold text-sm">🌱 Growing Strong</span>
          <span className="text-yellow-500">|</span>
          {/* <span className="text-purple-500 text-xs">Updated: Just now</span> */}
        </div>
      </div>
    </div>
  );
}