import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Check } from "lucide-react";
import { getProductIcon, formatPrice } from "../productStyles";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const { Icon, bg, fg } = getProductIcon(product.icon);

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md transition">
      <Link to={`/product/${product.id}`} className={`h-48 rounded-xl overflow-hidden flex items-center justify-center ${bg}`}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <Icon size={56} strokeWidth={1.75} className={fg} />
        )}
      </Link>

      <p className="text-xs font-medium text-indigo-600 mt-1">{product.category}</p>
      <Link to={`/product/${product.id}`} className="font-semibold hover:text-indigo-600">
        {product.name}
      </Link>

      <p className="flex items-center gap-1 text-sm">
        <Star size={14} className="fill-amber-400 text-amber-400" />
        <span className="font-medium">{product.rating}</span>
        <span className="text-gray-500">({product.reviews} reviews)</span>
      </p>

      <div className="flex justify-between items-center mt-auto pt-2">
        <span className="text-lg font-bold">{formatPrice(product.price)}</span>
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={`flex items-center gap-1.5 text-white text-sm font-semibold px-3 py-2 rounded-lg transition disabled:bg-gray-300 ${
            added ? "bg-green-600" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {added ? <Check size={14} /> : <ShoppingCart size={14} />}
          {product.stock === 0 ? "Sold out" : added ? "Added" : "Add"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;