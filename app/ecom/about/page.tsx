import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-100 to-purple-100 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            About <span className="text-pink-600">BeautyGlow</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your trusted destination for premium cosmetics at unbeatable prices.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 mb-6">
              At <span className="font-semibold">BeautyGlow</span>, we believe
              everyone deserves access to high-quality cosmetics without breaking
              the bank. We carefully curate products that are cruelty-free,
              dermatologist-tested, and perfect for all skin types.
            </p>
            <p className="text-gray-600 mb-6">
              With <span className="font-semibold">Cash on Delivery (COD)</span>,
              we make shopping risk-free and convenient for our customers.
            </p>
            <Link
              href="/products"
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg inline-block transition-colors"
            >
              Shop Now
            </Link>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
              alt="Cosmetics Collection"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Affordable Prices",
                description:
                  "We cut out middlemen to offer luxury-quality cosmetics at 30% less than competitors.",
                icon: "💰",
              },
              {
                title: "COD Available",
                description:
                  "Pay when you receive your order for a hassle-free experience.",
                icon: "📦",
              },
              {
                title: "100% Authentic",
                description:
                  "All products are sourced directly from trusted manufacturers.",
                icon: "✔️",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-md transition-shadow"
              >
                <span className="text-4xl mb-4 inline-block">{item.icon}</span>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Glow?</h2>
          <p className="text-xl mb-8">
            Join 50,000+ satisfied customers who trust us for their beauty needs.
          </p>
          <div className="space-x-4">
            <Link
              href="/products"
              className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium inline-block transition-colors"
            >
              Browse Products
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white hover:bg-white hover:text-pink-600 px-8 py-3 rounded-lg font-medium inline-block transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}