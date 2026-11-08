const columns = [
  { title: "Shop",    links: ["All products", "Audio", "Wearables", "Accessories"] },
  { title: "Help",    links: ["Shipping", "Returns", "Order tracking", "Contact us"] },
  { title: "Company", links: ["About us", "Careers", "Privacy policy", "Terms"] },
];

function Footer() {
  function handleSubscribe(e) {
    e.preventDefault();
    alert("Thanks for subscribing!");
    e.target.reset();
  }

  return (
    <footer className="bg-slate-900 text-gray-400 px-6 md:px-20 pt-14 pb-8">
      <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_2fr] gap-10">
        <div className="col-span-2 md:col-span-1">
          <p className="text-white font-bold text-xl">ShopLite</p>
          <p className="text-sm mt-3 max-w-xs">Quality tech for everyday life. Fast delivery across Sri Lanka.</p>
        </div>

        {columns.map(col => (
          <div key={col.title}>
            <p className="text-white font-semibold mb-4">{col.title}</p>
            <ul className="flex flex-col gap-3 text-sm">
              {col.links.map(link => (
                <li key={link}><a href="#" className="hover:text-white">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 md:col-span-1">
          <p className="text-white font-semibold mb-4">Get deals in your inbox</p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              required
              placeholder="name@example.com"
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white w-full outline-none focus:border-indigo-500"
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <p className="border-t border-slate-800 mt-12 pt-6 text-sm">
        © 2026 ShopLite · Built as a UOM IT student project
      </p>
    </footer>
  );
}

export default Footer;