import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Banknote, Loader2, ArrowLeft, UserCheck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../api";
import { getProductIcon, formatPrice, deliveryFor } from "../productStyles";

const inputClass =
  "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100";

function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || "", phone: "", address: "", city: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0 && !submitting) {
    return (
      <main className="px-6 md:px-20 py-24 text-center flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Nothing to check out</h1>
        <p className="text-gray-500">Your cart is empty.</p>
        <Link to="/" className="bg-indigo-600 text-white font-semibold px-5 py-3 rounded-lg">Start shopping</Link>
      </main>
    );
  }

  const delivery = deliveryFor(subtotal);
  const total = subtotal + delivery;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await authFetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map(item => ({ product_id: item.id, quantity: item.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not place order");

      navigate(`/order/${data.id}`, { replace: true });
      clearCart();
    } catch (err) {
      setError(err.message === "Failed to fetch" ? "Can't reach the server. Is it running?" : err.message);
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-slate-50 px-6 md:px-20 py-10">
      <Link to="/cart" className="flex items-center gap-2 text-indigo-600 font-semibold mb-6 w-fit">
        <ArrowLeft size={18} /> Back to cart
      </Link>
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full flex flex-col gap-6">
          {user ? (
            <p className="flex items-center gap-2 bg-green-50 text-green-800 text-sm rounded-xl px-4 py-3">
              <UserCheck size={18} /> Ordering as {user.email}. This order will appear in My orders.
            </p>
          ) : (
            <p className="bg-indigo-50 text-indigo-800 text-sm rounded-xl px-4 py-3">
              Have an account?{" "}
              <Link to="/login" state={{ from: "/checkout" }} className="font-semibold underline">Log in</Link>{" "}
              to track this order. You can also check out as a guest.
            </p>
          )}

          <section className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold">Delivery details</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Full name
                <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Kasun Perera" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-medium">
                Phone number
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  pattern="0[0-9]{9}"
                  title="10 digits starting with 0, e.g. 0771234567"
                  className={inputClass}
                  placeholder="0771234567"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Address
              <input name="address" value={form.address} onChange={handleChange} required className={inputClass} placeholder="House no, street" />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium">
              City
              <input name="city" value={form.city} onChange={handleChange} required className={inputClass} placeholder="Colombo" />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Delivery notes <span className="text-gray-400 font-normal">(optional)</span>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className={inputClass} placeholder="Landmark, best time to deliver..." />
            </label>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold">Payment</h2>
            <div className="flex items-center gap-4 border-2 border-indigo-600 bg-indigo-50 rounded-xl p-4">
              <span className="bg-white text-indigo-600 p-2 rounded-lg"><Banknote size={22} /></span>
              <div>
                <p className="font-semibold">Cash on delivery</p>
                <p className="text-sm text-gray-500">Pay when your order arrives</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="w-full lg:w-96 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 lg:sticky lg:top-24">
          <h2 className="text-xl font-bold">Order summary</h2>

          <div className="flex flex-col gap-3">
            {items.map(item => {
              const { Icon, bg, fg } = getProductIcon(item.icon);
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <span className={`w-12 h-12 shrink-0 rounded-lg overflow-hidden flex items-center justify-center ${bg}`}>
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      : <Icon size={22} className={fg} />}
                  </span>
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 pt-4 flex flex-col gap-2 text-gray-600">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{delivery === 0 ? <span className="text-green-600 font-medium">Free</span> : formatPrice(delivery)}</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-4">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>

          {error && <p className="text-sm bg-red-50 text-red-700 rounded-lg px-3 py-2">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-lg"
          >
            {submitting && <Loader2 size={18} className="animate-spin" />}
            {submitting ? "Placing order..." : `Place order · ${formatPrice(total)}`}
          </button>
        </aside>
      </form>
    </main>
  );
}

export default Checkout;