import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/hero-farm.jpg";
import { products } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { SectionHead } from "@/components/SectionHead";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AGRISETU – Smart Farming, Stronger Future" },
      { name: "description", content: "Seeds, fertilizers, tools and expert advice for Indian farmers — all in one marketplace." },
      { property: "og:title", content: "AGRISETU – Smart Farming, Stronger Future" },
      { property: "og:description", content: "Seeds, fertilizers, tools and expert advice for Indian farmers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const categories = [
  ["🌱", "Seeds"], ["🧪", "Fertilizers"], ["🛡️", "Pesticides"], ["🚜", "Machinery"],
  ["🔧", "Tools"], ["💧", "Irrigation"], ["🐄", "Livestock"], ["🌾", "Organic"],
];

function Index() {
  const { add } = useCart();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const shown = products.filter(
    (p) => p.name.toLowerCase().includes(q.toLowerCase()) && (!cat || p.categories.includes(cat)),
  );

  return (
    <>
      <section className="relative border-b-8 border-accent text-primary-foreground">
        <img src={hero} alt="Farmer walking through green fields at sunset" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-5 py-28 text-center">
          <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl">Smart Farming,<br />Stronger Future</h1>
          <p className="mb-9 text-lg font-light opacity-95 md:text-xl">Quality inputs, expert advice and fair prices — delivered to your village.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#shop" className="rounded-full bg-accent px-8 py-3.5 font-bold text-accent-foreground shadow-lg transition hover:-translate-y-0.5 hover:bg-card">Shop Now</a>
            <Link to="/crop-doctor" className="rounded-full border-2 border-primary-foreground px-8 py-3.5 font-bold transition hover:-translate-y-0.5 hover:bg-primary-foreground/10">Get Crop Advice</Link>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-9 max-w-3xl px-5">
        <div className="flex items-center rounded-full bg-card p-2 shadow-xl">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search seeds, fertilizers, tools..." className="flex-1 rounded-full bg-transparent px-6 py-3 text-lg outline-none" />
          <a href="#shop" className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground transition hover:opacity-90">Search</a>
        </div>
      </div>

      <main id="shop" className="mx-auto max-w-7xl px-5 py-16">
        <SectionHead title="Shop by Category" sub="Everything your farm needs" />
        <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map(([i, n]) => (
            <button key={n} aria-pressed={cat === n} onClick={() => setCat(cat === n ? null : n)}
              className={`rounded-xl border bg-card px-3 py-5 text-sm font-semibold shadow-sm transition hover:-translate-y-1 hover:border-secondary ${cat === n ? "border-primary ring-2 ring-primary" : "border-border"}`}>
              <span className="mb-2 block text-3xl">{i}</span>{n}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHead title={cat ? `${cat}` : "Featured Products"} sub={cat ? "Showing items in this category" : "Trusted by thousands of farmers"} />
          {cat && <button onClick={() => setCat(null)} className="mb-8 rounded-full bg-muted px-4 py-2 text-sm font-semibold">Show all ✕</button>}
        </div>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <img src={p.img} alt={p.alt} loading="lazy" width={1024} height={640} className="h-44 w-full object-cover" />
              <div className="p-5">
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${p.ok ? "bg-secondary text-secondary-foreground" : "bg-accent/30 text-foreground"}`}>{p.tag}</span>
                <h3 className="mt-3 text-lg font-bold">{p.name}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-primary">₹{p.price.toLocaleString("en-IN")}</span>
                  <button onClick={() => add(p.id)} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90">Add to cart</button>
                </div>
              </div>
            </div>
          ))}
          {shown.length === 0 && <p className="text-muted-foreground">No products found{cat ? ` in ${cat}` : ""}{q ? ` for "${q}"` : ""}.</p>}
        </div>
      </main>
    </>
  );
}
