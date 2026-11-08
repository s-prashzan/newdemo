import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Search, Heart, User, ShoppingCart, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/deals", label: "Deals" },
  { to: "/about", label: "About" },
];

function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 md:px-20 h-[76px] border-b border-gray-200">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold">
        <span className="bg-indigo-600 text-white p-1.5 rounded-lg">
          <ShoppingBag size={20} />
        </span>
        ShopLite
      </Link>

      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
        {links.map(link => (
          <NavLink
            key={link.label}
            to={link.to}
            end
            className={({ isActive }) => (isActive ? "text-indigo-600" : "hover:text-indigo-600")}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-64">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder="Search products" className="bg-transparent outline-none text-sm w-full" />
        </div>
        <button aria-label="Wishlist" className="border border-gray-200 rounded-lg p-2 hover:border-indigo-600">
          <Heart size={18} />
        </button>

        {user ? (
          <>
            <Link to="/my-orders" className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium hover:border-indigo-600">
              <User size={18} />
              <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
            </Link>
            <button onClick={logout} aria-label="Log out" title="Log out" className="border border-gray-200 rounded-lg p-2 hover:border-red-500 hover:text-red-600">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <Link to="/login" aria-label="Log in" className="border border-gray-200 rounded-lg p-2 hover:border-indigo-600">
            <User size={18} />
          </Link>
        )}

        <Link to="/cart" className="flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          <ShoppingCart size={16} />
          Cart
          <span className="bg-indigo-500 text-xs rounded-full px-2 py-0.5 min-w-6 text-center">{count}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;