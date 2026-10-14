import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/hero-farm.jpg";
import imgPaddy from "@/assets/product-paddy-seeds.jpg";
import imgVermi from "@/assets/product-vermicompost.jpg";
import imgDrip from "@/assets/product-drip-kit.jpg";
import imgNpk from "@/assets/product-npk.jpg";
import imgSprayer from "@/assets/product-sprayer.jpg";
import imgTomato from "@/assets/product-tomato-seeds.jpg";

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

const products = [
  { name: "Hybrid Paddy Seeds (5kg)", price: 1250, tag: "Bestseller", ok: true, img: imgPaddy, alt: "Sack of hybrid paddy rice seeds with golden grains" },
  { name: "Organic Vermicompost (25kg)", price: 480, tag: "Organic", ok: true, img: imgVermi, alt: "Bag of organic vermicompost with dark compost soil" },
  { name: "Drip Irrigation Kit – 1 Acre", price: 8900, tag: "Low stock", ok: false, img: imgDrip, alt: "Drip irrigation kit with tubing, filter and fittings" },
  { name: "NPK 19:19:19 (1kg)", price: 320, tag: "In stock", ok: true, img: imgNpk, alt: "Water-soluble NPK 19:19:19 fertilizer pouch" },
  { name: "Battery Knapsack Sprayer 16L", price: 3450, tag: "New", ok: true, img: imgSprayer, alt: "Battery-operated knapsack sprayer with lance and battery" },
  { name: "Tomato Seeds F1 (10g)", price: 210, tag: "Low stock", ok: false, img: imgTomato, alt: "F1 hybrid tomato seeds packet with fresh tomato" },
];

function Index() {
  const [cart, setCart] = useState(0);
  const [q, setQ] = useState("");
  const shown = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-2 text-center text-sm font-medium text-primary-foreground">
        🚚 Free delivery on orders above ₹999 · Expert helpline 1800-180-1551
      </div>

      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#" className="leading-none">
            <span className="text-2xl font-extrabold tracking-wide text-primary">AGRISETU</span>
            <span className="block text-[0.65rem] font-bold uppercase text-accent">Smart Farming</span>
          </a>
          <nav className="hidden gap-7 font-semibold md:flex">
            {["Shop", "Crop Advisory", "Mandi Prices", "Weather", "About"].map((n) => (
              <a key={n} href="#shop" className="border-b-2 border-transparent py-1 transition hover:border-accent hover:text-primary">{n}</a>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <span className="relative text-xl">🛒
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">{cart}</span>
            </span>
            <button className="rounded-full bg-muted px-4 py-2 text-sm font-semibold transition hover:bg-secondary hover:text-secondary-foreground">👤 Login</button>
          </div>
        </div>
      </header>

      <section className="relative border-b-8 border-accent text-primary-foreground">
        <img src={hero} alt="Farmer walking through green fields at sunset" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-5 py-28 text-center">
          <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl">Smart Farming,<br />Stronger Future</h1>
          <p className="mb-9 text-lg font-light opacity-95 md:text-xl">Quality inputs, expert advice and fair prices — delivered to your village.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#shop" className="rounded-full bg-accent px-8 py-3.5 font-bold text-accent-foreground shadow-lg transition hover:-translate-y-0.5 hover:bg-card">Shop Now</a>
            <a href="#shop" className="rounded-full border-2 border-primary-foreground px-8 py-3.5 font-bold transition hover:-translate-y-0.5 hover:bg-primary-foreground/10">Get Crop Advice</a>
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
            <button key={n} onClick={() => setQ("")} className="rounded-xl border border-border bg-card px-3 py-5 text-sm font-semibold shadow-sm transition hover:-translate-y-1 hover:border-secondary">
              <span className="mb-2 block text-3xl">{i}</span>{n}
            </button>
          ))}
        </div>

        <SectionHead title="Featured Products" sub="Trusted by thousands of farmers" />
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <div key={p.name} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <img src={p.img} alt={p.alt} loading="lazy" width={1024} height={640} className="h-44 w-full object-cover" />
              <div className="p-5">
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${p.ok ? "bg-secondary text-secondary-foreground" : "bg-accent/30 text-foreground"}`}>{p.tag}</span>
                <h3 className="mt-3 text-lg font-bold">{p.name}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-primary">₹{p.price.toLocaleString("en-IN")}</span>
                  <button onClick={() => setCart((c) => c + 1)} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90">Add to cart</button>
                </div>
              </div>
            </div>
          ))}
          {shown.length === 0 && <p className="text-muted-foreground">No products match "{q}".</p>}
        </div>
      </main>

      <footer className="bg-primary py-10 text-sm text-primary-foreground">
        <p className="text-center text-xl font-extrabold tracking-wide">AGRISETU</p>
        <p className="mt-2 text-center opacity-80">© 2026 AgriSetu · Bridging farmers to a better tomorrow</p>

        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-primary-foreground/20 pt-6 text-center font-medium">
          <span className="flex items-center gap-2">
            <span aria-hidden>📍</span> PES College of Engineering, Mandya
          </span>
          <a href="tel:+918050209899" className="flex items-center gap-2 transition hover:text-accent">
            <span aria-hidden>📞</span> 8050209899
          </a>
          <a href="mailto:agrisetu@gmail.com" className="flex items-center gap-2 transition hover:text-accent">
            <span aria-hidden>✉️</span> agrisetu@gmail.com
          </a>
        </div>

        <div className="mt-6 border-t border-primary-foreground/20 pt-5 text-center text-xs font-semibold uppercase tracking-wider opacity-90">
          <p>
            Developed by <span className="text-accent">Errorless Pvt Ltd.</span>
          </p>
          <p className="mt-2 text-[0.7rem] font-bold normal-case tracking-normal opacity-95">
            Bsavaraju M Nagoor · Gagan Gowda N · Shrungar H D · Avinash P
          </p>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-8 border-l-4 border-primary pl-4">
      <h2 className="text-3xl font-extrabold text-primary">{title}</h2>
      <p className="mt-1 text-muted-foreground">{sub}</p>
    </div>
  );
}
