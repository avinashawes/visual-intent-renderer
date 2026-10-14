import imgPaddy from "@/assets/product-paddy-seeds.jpg";
import imgVermi from "@/assets/product-vermicompost.jpg";
import imgDrip from "@/assets/product-drip-kit.jpg";
import imgNpk from "@/assets/product-npk.jpg";
import imgSprayer from "@/assets/product-sprayer.jpg";
import imgTomato from "@/assets/product-tomato-seeds.jpg";

export type Product = { id: string; name: string; price: number; tag: string; ok: boolean; img: string; alt: string; categories: string[] };

export const products: Product[] = [
  { id: "paddy", name: "Hybrid Paddy Seeds (5kg)", price: 1250, tag: "Bestseller", ok: true, img: imgPaddy, alt: "Sack of hybrid paddy rice seeds with golden grains", categories: ["Seeds"] },
  { id: "vermi", name: "Organic Vermicompost (25kg)", price: 480, tag: "Organic", ok: true, img: imgVermi, alt: "Bag of organic vermicompost with dark compost soil", categories: ["Fertilizers", "Organic"] },
  { id: "drip", name: "Drip Irrigation Kit – 1 Acre", price: 8900, tag: "Low stock", ok: false, img: imgDrip, alt: "Drip irrigation kit with tubing, filter and fittings", categories: ["Irrigation"] },
  { id: "npk", name: "NPK 19:19:19 (1kg)", price: 320, tag: "In stock", ok: true, img: imgNpk, alt: "Water-soluble NPK 19:19:19 fertilizer pouch", categories: ["Fertilizers"] },
  { id: "sprayer", name: "Battery Knapsack Sprayer 16L", price: 3450, tag: "New", ok: true, img: imgSprayer, alt: "Battery-operated knapsack sprayer with lance and battery", categories: ["Tools", "Machinery", "Pesticides"] },
  { id: "tomato", name: "Tomato Seeds F1 (10g)", price: 210, tag: "Low stock", ok: false, img: imgTomato, alt: "F1 hybrid tomato seeds packet with fresh tomato", categories: ["Seeds"] },
];

export const GST_RATE = 0.05;
export const DELIVERY_FEE = 50;
export const FREE_DELIVERY_ABOVE = 999;

export function cartTotals(subtotal: number) {
  const gst = Math.round(subtotal * GST_RATE * 100) / 100;
  const delivery = subtotal === 0 || subtotal > FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  return { subtotal, gst, delivery, total: subtotal + gst + delivery };
}
