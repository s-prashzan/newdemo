import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Check } from "lucide-react";
import { API_URL } from "../api";
import { getProductIcon, formatPrice } from "../productStyles";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then(data => setProduct(data))
      .catch(err => setError(err.message));
  }, [id]);

  if (error) return <p className="px-6 md:px-20 py-12 text-red-600">{error}</p>;
  if (!product) return <p className="px-6 md:px-20 py-12 text-gray-500">Loading...</p>;

  const { Icon, bg, fg } = getProductIcon(product.icon);
  const soldOut = product.stock === 0;

  function handleAdd() {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addToCart(product, quantity);
    navigate("/cart");
  }

  return (
    <main className="px-6 md:px-20 py-8">
      <p className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-indigo-600">Home</Link> / {product.category} / {product.name}
      </p>

      <div className="flex flex-col md:flex-row gap-14">
        <div className="flex-1">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-[460px] object-cover rounded-2xl" />
          ) : (
            <div className={`w-full h-[460px] rounded-2xl flex items-center justify-center ${bg}`}>
              <Icon size={160} strokeWidth={1.5} className={fg} />
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <p className="text-indigo-600 text-sm font-medium">{product.category}</p>
          <h1 className="text-4xl font-bold">{product.name}</h1>

          <p className="flex items-center gap-1 text-sm">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-gray-500">({product.reviews} reviews)</span>
          </p>

          <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
          <p className="text-gray-500">{product.description}</p>
          <p className={soldOut ? "text-red-600 text-sm" : "text-green-600 text-sm"}>
            {soldOut ? "Out of stock" : `In stock (${product.stock} left)`}
          </p>

          <p className="font-semibold mt-2">Quantity</p>
          <div className="flex items-center gap-5 border border-gray-200 rounded-lg px-4 py-2 w-fit">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
            <span className="w-6 text-center">{quantity}</span>
            <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} aria-label="Increase quantity">+</button>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={handleAdd}
              disabled={soldOut}
              className={`flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-lg transition disabled:bg-gray-300 ${
                added ? "bg-green-600" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {added && <Check size={18} />}
              {added ? "Added to cart" : "Add to cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={soldOut}
              className="border border-gray-200 font-semibold px-6 py-3 rounded-lg hover:border-indigo-600 disabled:opacity-50"
            >
              Buy now
            </button>
          </div>

          <ul className="text-sm text-gray-500 flex flex-col gap-1 mt-4">
            <li>✓ Free delivery on orders over Rs. 10,000</li>
            <li>✓ 30-day easy returns</li>
            <li>✓ Cash on delivery available</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;