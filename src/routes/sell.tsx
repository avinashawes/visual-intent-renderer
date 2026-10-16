import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { estimatedValue, findMsp, mspCrops, type ProduceType } from "@/lib/msp";
import { SectionHead } from "@/components/SectionHead";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sell")({
  head: () => ({ meta: [
    { title: "Sell Crops at MSP – AGRISETU" },
    { name: "description", content: "List grain, crops and vegetables for government procurement or district mandi sale." },
    { property: "og:title", content: "Sell Crops at MSP – AGRISETU" },
    { property: "og:description", content: "Create a selling request with current government MSP references." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: SellPage,
});

type Unit = "quintal" | "kg" | "tonne";
const input = "mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring";

function SellPage() {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [rows, setRows] = useState<Tables<"sell_requests">[]>([]);
  const [type, setType] = useState<ProduceType>("grain");
  const [crop, setCrop] = useState("Paddy (Common)");
  const [other, setOther] = useState("");
  const [qty, setQty] = useState("10");
  const [unit, setUnit] = useState<Unit>("quintal");
  const [dest, setDest] = useState<"government" | "district_mandi">("government");
  const [district, setDistrict] = useState("Mandya");
  const [village, setVillage] = useState("");
  const [phone, setPhone] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const msp = type === "vegetable" || crop === "other" ? null : findMsp(crop);
  const price = msp?.price ?? Number(minPrice);
  const value = useMemo(() => Number(qty) > 0 && price > 0 ? estimatedValue(Number(qty), unit, price) : 0, [qty, unit, price]);

  const load = async (uid: string) => {
    const { data, error } = await supabase.from("sell_requests").select("*").eq("user_id", uid).order("created_at", { ascending: false });
    if (error) { setMsg({ ok: false, text: "Could not load your requests. Please refresh to try again." }); return; }
    setRows(data ?? []);
  };
  useEffect(() => { supabase.auth.getUser().then(({ data }) => { setUserId(data.user?.id ?? null); if (data.user) load(data.user.id); }); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!userId) return; setBusy(true); setMsg(null);
    const { error } = await supabase.from("sell_requests").insert({
      user_id: userId, produce_type: type, produce_name: msp ? msp.name : other.trim(), quantity: Number(qty), unit,
      destination: dest, district: district.trim(), village: village.trim() || null, phone,
      price_basis: msp ? "msp" : "farmer_minimum", price_per_quintal: price,
      msp_season: msp?.season ?? null, msp_source: msp?.source ?? null, notes: notes.trim() || null,
    });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: "Could not save. Check the details and try again." });
    setMsg({ ok: true, text: "Selling request saved in AGRISETU." }); setNotes(""); load(userId);
  };

  const cancel = async (id: string) => {
    if (!userId) return;
    const { error } = await supabase.from("sell_requests").update({ status: "cancelled" }).eq("id", id).eq("user_id", userId);
    if (error) { setMsg({ ok: false, text: "Could not cancel your request. Try again." }); return; }
    load(userId);
  };

  return (
    <main className="mx-auto max-w-7xl px-5 py-14">
      <SectionHead title="Sell Your Produce" sub="Create a request for government procurement or your district mandi" />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mspCrops.map((c) => <div key={c.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-semibold text-muted-foreground">{c.name}</p><p className="text-2xl font-extrabold text-primary">₹{c.price.toLocaleString("en-IN")}<span className="text-sm font-semibold">/quintal</span></p>
          <a href={c.source} target="_blank" rel="noopener noreferrer" className="text-xs underline">{c.season} ↗</a></div>)}
      </div>
      <p className="mb-8 rounded-xl bg-accent/20 p-4 text-sm">Requests are saved here for your record and follow-up. They are not yet sent to a government office or mandi. Vegetables have no national MSP, so enter your minimum price.</p>
      <p className="mb-6 text-sm text-muted-foreground">MSP references are season-specific. Procurement depends on registration, quality, local centres and purchase windows; payment or purchase is not guaranteed. For other MSP-covered crops, confirm the official rate before entering your minimum.</p>
      {userId === null ? <div className="rounded-2xl border border-border bg-card p-8 text-center"><p className="mb-4 font-semibold">Sign in to create a selling request.</p><Link to="/auth" className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">Sign in</Link></div> :
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:grid-cols-2">
          <label className="text-sm font-semibold">Produce type<select value={type} onChange={(e) => { const t = e.target.value as ProduceType; setType(t); setCrop(t === "vegetable" ? "other" : "Paddy (Common)"); }} className={input}><option value="grain">Grain</option><option value="crop">Crop</option><option value="vegetable">Fresh vegetable</option></select></label>
          {type !== "vegetable" && <label className="text-sm font-semibold">Crop<select value={crop} onChange={(e) => setCrop(e.target.value)} className={input}>{mspCrops.map((c) => <option key={c.name}>{c.name}</option>)}<option value="other">Other</option></select></label>}
          {!msp && <label className="text-sm font-semibold">Produce name<input required minLength={2} maxLength={80} value={other} onChange={(e) => setOther(e.target.value)} placeholder="e.g. Tomato" className={input} /></label>}
          {!msp && <label className="text-sm font-semibold">Your minimum price (₹/quintal)<input required type="number" min="1" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className={input} /></label>}
          <label className="text-sm font-semibold">Quantity<input required type="number" min="0.01" max="100000" step="0.01" value={qty} onChange={(e) => setQty(e.target.value)} className={input} /></label>
          <label className="text-sm font-semibold">Unit<select value={unit} onChange={(e) => setUnit(e.target.value as Unit)} className={input}><option value="quintal">Quintal</option><option value="kg">Kg</option><option value="tonne">Tonne</option></select></label>
          <label className="text-sm font-semibold">Sell to<select value={dest} onChange={(e) => setDest(e.target.value as typeof dest)} className={input}><option value="government">Government procurement</option><option value="district_mandi">District mandi</option></select></label>
          <label className="text-sm font-semibold">District<input required minLength={2} maxLength={60} value={district} onChange={(e) => setDistrict(e.target.value)} className={input} /></label>
          <label className="text-sm font-semibold">Village (optional)<input maxLength={80} value={village} onChange={(e) => setVillage(e.target.value)} className={input} /></label>
          <label className="text-sm font-semibold">Mobile number<input required pattern="[6-9][0-9]{9}" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit number" className={input} /></label>
          <label className="text-sm font-semibold sm:col-span-2">Notes (optional)<textarea maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} className={input} /></label>
          <div className="rounded-xl bg-secondary p-4 text-secondary-foreground sm:col-span-2"><p className="text-sm font-semibold">{msp ? `MSP: ₹${msp.price.toLocaleString("en-IN")}/quintal` : "Price: your minimum price"}</p><p className="text-2xl font-extrabold">Estimated value ₹{value.toLocaleString("en-IN")}</p></div>
          {msg && <p className={`text-sm sm:col-span-2 ${msg.ok ? "text-primary" : "text-destructive"}`}>{msg.text}</p>}
          <Button type="submit" disabled={busy || userId === undefined} className="h-12 rounded-full font-bold sm:col-span-2">{busy ? "Saving…" : "Create selling request"}</Button>
        </form>
        <section><h2 className="mb-4 text-2xl font-bold text-primary">My requests</h2><div className="space-y-3">
          {rows.length === 0 && <p className="text-muted-foreground">No selling requests yet.</p>}
          {rows.map((r) => <article key={r.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex justify-between gap-3"><h3 className="font-bold">{r.produce_name}</h3><span className="rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase">{r.status}</span></div>
            <p className="text-sm text-muted-foreground">{r.quantity} {r.unit} · {r.destination === "government" ? "Government" : "District mandi"} · {r.district}</p>
            <p className="font-semibold text-primary">₹{Number(r.price_per_quintal).toLocaleString("en-IN")}/quintal {r.price_basis === "msp" ? "MSP" : "minimum"}</p>
            {r.status === "listed" && <Button variant="ghost" onClick={() => cancel(r.id)} className="mt-2 text-destructive">Cancel request</Button>}
          </article>)}
        </div></section>
      </div>}
    </main>
  );
}