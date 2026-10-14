import { createFileRoute } from "@tanstack/react-router";
import { SectionHead } from "@/components/SectionHead";

export const Route = createFileRoute("/schemes")({
  head: () => ({
    meta: [
      { title: "Government Funds & Support for Farmers – AGRISETU" },
      { name: "description", content: "Key central and Karnataka government schemes, subsidies and loans for farmers, with links to apply." },
      { property: "og:title", content: "Government Funds & Support for Farmers" },
      { property: "og:description", content: "PM-KISAN, crop insurance, KCC loans, irrigation subsidies and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Schemes,
});

const schemes = [
  { name: "PM-KISAN", tag: "Income support", body: "₹6,000 per year paid in three instalments directly to eligible farmer families' bank accounts.", url: "https://pmkisan.gov.in" },
  { name: "Pradhan Mantri Fasal Bima Yojana", tag: "Crop insurance", body: "Low-premium insurance against crop loss from natural calamities, pests and diseases.", url: "https://pmfby.gov.in" },
  { name: "Kisan Credit Card (KCC)", tag: "Loans", body: "Short-term credit for crop and allied needs at concessional interest with timely-repayment benefits.", url: "https://www.myscheme.gov.in/schemes/kcc" },
  { name: "PM Krishi Sinchayee Yojana", tag: "Irrigation subsidy", body: "Subsidy for drip and sprinkler micro-irrigation — 'Per Drop More Crop'.", url: "https://pmksy.gov.in" },
  { name: "Soil Health Card", tag: "Free soil testing", body: "Free soil testing with crop-wise nutrient and fertilizer recommendations.", url: "https://soilhealth.dac.gov.in" },
  { name: "Sub-Mission on Agricultural Mechanization", tag: "Machinery subsidy", body: "Financial help to buy tractors, tillers, sprayers and to set up custom hiring centres.", url: "https://agrimachinery.nic.in" },
  { name: "PM-KUSUM", tag: "Solar pumps", body: "Subsidy for solar irrigation pumps and grid-connected solar on farmland.", url: "https://pmkusum.mnre.gov.in" },
  { name: "e-NAM", tag: "Market access", body: "Online national agriculture market to sell produce across mandis for better prices.", url: "https://enam.gov.in" },
  { name: "Raitha Siri / Karnataka Krishi schemes", tag: "Karnataka", body: "State support for millets, inputs and farm equipment through Raitha Samparka Kendras.", url: "https://raitamitra.karnataka.gov.in" },
];

function Schemes() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-14">
      <SectionHead title="Government Funds & Support" sub="Schemes, subsidies and loans available to farmers" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {schemes.map((s) => (
          <article key={s.name} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
            <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase text-secondary-foreground">{s.tag}</span>
            <h2 className="mt-3 text-xl font-bold text-primary">{s.name}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.body}</p>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-4 w-fit rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">Learn & apply ↗</a>
          </article>
        ))}
      </div>
      <p className="mt-10 rounded-xl bg-accent/20 p-4 text-sm">Need help applying? Call us at <a href="tel:+918050209899" className="font-bold">8050209899</a> or visit your nearest Raitha Samparka Kendra. Amounts and eligibility change — always confirm on the official site.</p>
    </main>
  );
}
