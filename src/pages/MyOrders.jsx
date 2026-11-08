import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../api";
import { formatPrice } from "../productStyles";

function MyOrders() {
  const { user, authFetch, logout } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    authFetch(`${API_URL}/my-orders`)
      .then(res => {
        if (res.status === 401) {
          logout();
          return [];
        }
        if (!res.ok) throw new Error("Couldn't load your orders");
        return res.json();
      })
      .then(data => setOrders(data))
      .catch(err => setError(err.message));
  }, [user, authFetch, logout]);

  if (!user) return <Navigate to="/login" state={{ from: "/my-orders" }} replace />;

  return (
    <main className="bg-slate-50 px-6 md:px-20 py-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">My orders</h1>
          <p className="text-gray-500 mt-1">Signed in as {user.email}</p>
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {!orders && !error && <p className="text-gray-500">Loading...</p>}

        {orders?.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center flex flex-col items-center gap-3">
            <span className="bg-indigo-50 text-indigo-600 p-4 rounded-full"><Package size={30} /></span>
            <p className="font-semibold">No orders yet</p>
            <Link to="/" className="text-indigo-600 font-semibold">Start shopping</Link>
          </div>
        )}

        {orders?.map(order => (
          <Link
            key={order.id}
            to={`/order/${order.id}`}
            className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 hover:border-indigo-600 transition"
          >
            <span className="bg-indigo-50 text-indigo-600 p-3 rounded-xl"><Package size={22} /></span>
            <div className="flex-1">
              <p className="font-semibold">Order #{order.id}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString("en-LK")} · {order.item_count} {order.item_count === 1 ? "item" : "items"}
              </p>
            </div>
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full capitalize">{order.status}</span>
            <span className="font-bold w-28 text-right">{formatPrice(order.total)}</span>
            <ChevronRight size={18} className="text-gray-400" />
          </Link>
        ))}
      </div>
    </main>
  );
}

export default MyOrders;