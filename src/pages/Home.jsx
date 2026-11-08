import { useEffect, useState } from "react";
import {
  Headphones, Watch, Keyboard, Lightbulb,
  Truck, ShieldCheck, RefreshCw, Headset, ArrowRight,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { API_URL } from "../api";

const categories = [
  { name: "Audio",       Icon: Headphones, bg: "bg-indigo-100", fg: "text-indigo-600" },
  { name: "Wearables",   Icon: Watch,      bg: "bg-pink-100",   fg: "text-pink-600" },
  { name: "Accessories", Icon: Keyboard,   bg: "bg-amber-100",  fg: "text-amber-700" },
  { name: "Smart home",  Icon: Lightbulb,  bg: "bg-yellow-100", fg: "text-yellow-700" },
];

const stats = [
  { value: "10k+", label: "Happy customers" },
  { value: "500+", label: "Products" },
  { value: "4.8",  label: "Average rating" },
];

const benefits = [
  { Icon: Truck,       title: "Free shipping",  text: "On orders over Rs. 10,000" },
  { Icon: ShieldCheck, title: "Secure payment", text: "100% protected checkout" },
  { Icon: RefreshCw,   title: "30-day returns", text: "Hassle-free returns" },
  { Icon: Headset,     title: "24/7 support",   text: "We are here to help" },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load every product once; filtering happens below in React
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setError("Couldn't load products. Is the server running?"))
      .finally(() => setLoading(false));
  }, []);

  const shown = category === "All" ? products : products.filter(p => p.category === category);
  const countFor = name => products.filter(p => p.category === name).length;

  return (
    <main className="bg-slate-50">
      {/* Hero */}
      <section className="bg-indigo-50 px-6 md:px-20 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 flex flex-col gap-6">
          <span className="bg-white text-indigo-600 text-sm font-medium px-4 py-1.5 rounded-full w-fit border border-indigo-100">
            Winter sale · up to 40% off
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">Tech that fits your everyday life</h1>
          <p className="text-lg text-gray-500 max-w-lg">
            Headphones, wearables and accessories from trusted brands. Free delivery on orders over Rs. 10,000.
          </p>
          <div className="flex gap-3">
            <a href="#products" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-lg">Shop now</a>
            <button className="border border-gray-200 bg-white font-semibold px-5 py-3 rounded-lg">View deals</button>
          </div>
          <div className="flex gap-10">
            {stats.map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full h-80 md:h-[440px] bg-indigo-200 rounded-3xl flex flex-col items-center justify-center gap-6">
          <Headphones size={160} strokeWidth={1.5} className="text-indigo-700" />
          <div className="bg-white rounded-xl shadow-md px-4 py-3 flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-500">Best seller</p>
              <p className="font-semibold text-sm">Wireless headphones</p>
            </div>
            <span className="font-bold text-indigo-600">Rs. 8,900</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 md:px-20 pt-16">
        <h2 className="text-3xl font-bold mb-6">Shop by category</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(({ name, Icon, bg, fg }) => (
            <button
              key={name}
              onClick={() => setCategory(name)}
              className={`bg-white border rounded-2xl p-5 flex items-center gap-4 text-left transition ${
                category === name ? "border-indigo-600 ring-2 ring-indigo-100" : "border-gray-200 hover:border-indigo-600"
              }`}
            >
              <span className={`${bg} ${fg} p-3 rounded-xl`}>
                <Icon size={26} />
              </span>
              <span>
                <span className="block font-semibold">{name}</span>
                <span className="block text-sm text-gray-500">{countFor(name)} products</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section id="products" className="px-6 md:px-20 py-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-bold">{category === "All" ? "Featured products" : category}</h2>
            <p className="text-gray-500 mt-1">Hand-picked favourites this week</p>
          </div>
          <button onClick={() => setCategory("All")} className="flex items-center gap-1.5 text-indigo-600 font-semibold">
            View all <ArrowRight size={18} />
          </button>
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {loading && <p className="text-gray-500">Loading products...</p>}
        {!loading && !error && shown.length === 0 && (
          <p className="text-gray-500">No products in this category yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shown.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 md:px-20 pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map(({ Icon, title, text }) => (
          <div key={title} className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
            <span className="bg-indigo-50 text-indigo-600 p-3 rounded-full">
              <Icon size={22} />
            </span>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-gray-500">{text}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default Home;