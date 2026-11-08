import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getProductIcon, formatPrice } from "../productStyles";

const FREE_DELIVERY_FROM = 10000;
const DELIVERY_FEE = 350;

function Cart() {
  const { items, count, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="px-6 md:px-20 py-24 flex flex-col items-center text-center gap-4">
        <span className="bg-indigo-50 text-indigo-600 p-5 rounded-full">
          <ShoppingCart size={36} />
        </span>
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="text-gray-500">Looks like you haven't added anything yet.</p>
        <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-lg mt-2">
          Start shopping
        </Link>
      </main>
    );
  }

  const delivery = subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;
  const amountForFreeDelivery = FREE_DELIVERY_FROM - subtotal;

  return (
    <main className="bg-slate-50 px-6 md:px-20 py-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your cart</h1>
          <p className="text-gray-500 mt-1">{count} {count === 1 ? "item" : "items"}</p>
        </div>
        <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-600">
          Clear cart
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Items */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {items.map(item => {
            const { Icon, bg, fg } = getProductIcon(item.icon);
            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <Link to={`/product/${item.id}`} className={`w-24 h-24 shrink-0 rounded-xl overflow-hidden flex items-center justify-center ${bg}`}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Icon size={36} strokeWidth={1.75} className={fg} />
                  )}
                </Link>

                <div className="flex-1">
                  <p className="text-xs font-medium text-indigo-600">{item.category}</p>
                  <Link to={`/product/${item.id}`} className="font-semibold hover:text-indigo-600">{item.name}</Link>
                  <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
                </div>

                <div className="flex items-center gap-4 border border-gray-200 rounded-lg px-3 py-2 w-fit">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity === 1}
                    aria-label="Decrease quantity"
                    className="disabled:text-gray-300"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-6 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    aria-label="Increase quantity"
                    className="disabled:text-gray-300"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <p className="font-bold w-28 sm:text-right">{formatPrice(item.price * item.quantity)}</p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="text-gray-400 hover:text-red-600 w-fit"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}

          <Link to="/" className="flex items-center gap-2 text-indigo-600 font-semibold mt-2 w-fit">
            <ArrowLeft size={18} /> Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <aside className="w-full lg:w-96 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 lg:sticky lg:top-24">
          <h2 className="text-xl font-bold">Order summary</h2>

          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery</span>
            <span>{delivery === 0 ? <span className="text-green-600 font-medium">Free</span> : formatPrice(delivery)}</span>
          </div>

          {amountForFreeDelivery > 0 && (
            <p className="text-sm bg-indigo-50 text-indigo-700 rounded-lg px-3 py-2">
              Add {formatPrice(amountForFreeDelivery)} more for free delivery.
            </p>
          )}

          <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-4">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Link
  to="/checkout"
  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg text-center"
>
  Proceed to checkout
</Link>
          <p className="text-xs text-gray-500 text-center">Cash on delivery available</p>
        </aside>
      </div>
    </main>
  );
}

export default Cart;