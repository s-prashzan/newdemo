import { Headphones, Watch, Speaker, Keyboard, Activity, Mouse, Lightbulb, Camera, Package } from "lucide-react";

// Each product's icon name (from the database) → icon + tile colours
const productIcons = {
  headphones: { Icon: Headphones, bg: "bg-indigo-100",  fg: "text-indigo-600" },
  watch:      { Icon: Watch,      bg: "bg-pink-100",    fg: "text-pink-600" },
  speaker:    { Icon: Speaker,    bg: "bg-emerald-100", fg: "text-emerald-700" },
  keyboard:   { Icon: Keyboard,   bg: "bg-amber-100",   fg: "text-amber-700" },
  activity:   { Icon: Activity,   bg: "bg-violet-100",  fg: "text-violet-600" },
  mouse:      { Icon: Mouse,      bg: "bg-sky-100",     fg: "text-sky-700" },
  bulb:       { Icon: Lightbulb,  bg: "bg-yellow-100",  fg: "text-yellow-700" },
  camera:     { Icon: Camera,     bg: "bg-rose-100",    fg: "text-rose-600" },
};

const fallback = { Icon: Package, bg: "bg-gray-100", fg: "text-gray-500" };

export function getProductIcon(name) {
  return productIcons[name] || fallback;
}

export function formatPrice(amount) {
  return `Rs. ${Number(amount).toLocaleString("en-LK")}`;
}

export const FREE_DELIVERY_FROM = 10000;
export const DELIVERY_FEE = 350;

export function deliveryFor(subtotal) {
  return subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
}