import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { API_URL } from "../api";
import { getProductIcon, formatPrice } from "../productStyles";
import { useAuth } from "../context/AuthContext";
function OrderConfirmation() {
  const { id } = useParams();
  const { authFetch } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

 useEffect(() => {
  authFetch(`${API_URL}/orders/${id}`)
    .then(res => {
      if (!res.ok) throw new Error("Order not found");
      return res.json();
    })
    .then(data => setOrder(data))
    .catch(err => setError(err.message));
}, [id, authFetch]);
  if (error) return <p className="px-6 md:px-20 py-12 text-red-600">{error}</p>;
  if (!order) return <p className="px-6 md:px-20 py-12 text-gray-500">Loading...</p>;

  return (
    <main className="bg-slate-50 px-6 md:px-20 py-12">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div className="text-center flex flex-col items-center gap-3">
          <CheckCircle2 size={56} className="text-green-600" />
          <h1 className="text-3xl font-bold">Thank you, {order.customer_name}!</h1>
          <p className="text-gray-500">
            Order <span className="font-semibold text-gray-900">#{order.id}</span> has been placed. We'll call you on {order.phone} to confirm delivery.
          </p>
        </div>

        <section className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Order details</h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full capitalize">{order.status}</span>
          </div>

          {order.items.map(item => {
            const { Icon, bg, fg } = getProductIcon(item.icon);
            return (
              <div key={item.product_id} className="flex items-center gap-3">
                <span className={`w-12 h-12 shrink-0 rounded-lg overflow-hidden flex items-center justify-center ${bg}`}>
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    : <Icon size={22} className={fg} />}
                </span>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">{item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            );
          })}

          <div className="border-t border-gray-200 pt-4 flex flex-col gap-2 text-gray-600">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{Number(order.delivery_fee) === 0 ? "Free" : formatPrice(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-6 grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold mb-1">Delivering to</p>
            <p className="text-gray-500">{order.customer_name}<br />{order.address}<br />{order.city}</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Payment</p>
            <p className="text-gray-500">Cash on delivery</p>
            <p className="font-semibold mt-3 mb-1">Placed on</p>
            <p className="text-gray-500">{new Date(order.created_at).toLocaleString("en-LK")}</p>
          </div>
        </section>

        <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-lg text-center w-fit mx-auto">
          Continue shopping
        </Link>
      </div>
    </main>
  );
}

export default OrderConfirmation;