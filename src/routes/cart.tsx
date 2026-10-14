import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { products, cartTotals, FREE_DELIVERY_ABOVE } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart – AGRISETU" },
      { name: "description", content: "Review your farm supplies, quantities, GST and delivery charges." },
      { property: "og:title", content: "Your Cart – AGRISETU" },
      { property: "og:description", content: "Review quantities, GST and delivery charges." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

const inr = (n: number) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function CartPage() {
  const { items, setQty, clear } = useCart();
  const lines = products.filter((p) => items[p.id]).map((p) => ({ ...p, qty: items[p.id] }));
  const t = cartTotals(lines.reduce((s, l) => s + l.price * l.qty, 0));

  if (lines.length === 0)
    return (
      <main className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="text-5xl">🛒</p>
        <h1 className="mt-4 text-3xl font-extrabold text-primary">Your cart is empty</h1>
        <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground">Browse products</Link>
      </main>
    );

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1fr_360px]">
      <section>
        <h1 className="mb-6 text-3xl font-extrabold text-primary">Your Cart</h1>
        <ul className="space-y-4">
          {lines.map((l) => (
            <li key={l.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <img src={l.img} alt={l.alt} className="h-20 w-24 rounded-lg object-cover" />
              <div className="flex-1">
                <h2 className="font-bold">{l.name}</h2>
                <p className="text-sm text-muted-foreground">{inr(l.price)} each</p>
                <button onClick={() => setQty(l.id, 0)} className="mt-1 text-sm font-semibold text-destructive">Remove</button>
              </div>
              <div className="flex items-center rounded-full border border-border">
                <button aria-label="Decrease" onClick={() => setQty(l.id, l.qty - 1)} className="h-9 w-9 text-lg font-bold">−</button>
                <span className="w-8 text-center font-bold">{l.qty}</span>
                <button aria-label="Increase" onClick={() => setQty(l.id, l.qty + 1)} className="h-9 w-9 text-lg font-bold">+</button>
              </div>
              <p className="w-28 text-right font-extrabold text-primary">{inr(l.price * l.qty)}</p>
            </li>
          ))}
        </ul>
      </section>
      <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-extrabold">Order Summary</h2>
        <dl className="space-y-2 text-sm">
          <Row k="Subtotal" v={inr(t.subtotal)} />
          <Row k="GST (5%)" v={inr(t.gst)} />
          <Row k="Delivery" v={t.delivery ? inr(t.delivery) : "FREE"} />
        </dl>
        {t.delivery > 0 && <p className="mt-3 rounded-lg bg-accent/20 p-2 text-xs">Add {inr(FREE_DELIVERY_ABOVE + 1 - t.subtotal)} more for free delivery.</p>}
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-extrabold"><span>Total</span><span className="text-primary">{inr(t.total)}</span></div>
        <button onClick={() => { toast.success("Order placed! We'll call you to confirm."); clear(); }} className="mt-5 w-full rounded-full bg-primary py-3 font-bold text-primary-foreground">Place order</button>
      </aside>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></div>;
}
