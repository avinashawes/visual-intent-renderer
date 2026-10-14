import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { diagnoseCrop } from "@/lib/crop-doctor.functions";
import { SectionHead } from "@/components/SectionHead";

export const Route = createFileRoute("/crop-doctor")({
  head: () => ({
    meta: [
      { title: "Crop Doctor – AI Crop Problem Help | AGRISETU" },
      { name: "description", content: "Describe your crop problem and upload a photo to get likely causes and practical next steps." },
      { property: "og:title", content: "Crop Doctor – AGRISETU" },
      { property: "og:description", content: "Get likely causes and next steps for crop problems from a photo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CropDoctor,
});

function shrink(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 1280 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = img.width * s; c.height = img.height * s;
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function CropDoctor() {
  const run = useServerFn(diagnoseCrop);
  const [crop, setCrop] = useState("");
  const [problem, setProblem] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError(null); setResult(null);
    try {
      const r = await run({ data: { crop, problem, image } });
      if (r.ok) setResult(r.text); else setError(r.error);
    } catch { setError("Something went wrong. Please try again."); }
    setBusy(false);
  };

  const input = "w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring";
  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-2">
      <section>
        <SectionHead title="Crop Doctor" sub="Describe the problem, add a photo, get practical advice" />
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <label className="block text-sm font-semibold">Crop
            <input value={crop} onChange={(e) => setCrop(e.target.value)} maxLength={80} placeholder="e.g. Paddy, Tomato, Sugarcane" className={`${input} mt-1`} />
          </label>
          <label className="block text-sm font-semibold">What's wrong?
            <textarea required minLength={5} maxLength={2000} rows={5} value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Leaves turning yellow with brown spots, started 5 days ago after rain…" className={`${input} mt-1`} />
          </label>
          <label className="block text-sm font-semibold">Photo (optional)
            <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; setImage(f ? await shrink(f) : null); }} className="mt-1 block w-full text-sm" />
          </label>
          {image && <img src={image} alt="Uploaded crop" className="max-h-56 rounded-xl object-cover" />}
          <button disabled={busy} className="w-full rounded-full bg-primary py-3 font-bold text-primary-foreground disabled:opacity-60">{busy ? "Analysing… (up to a minute)" : "Get advice"}</button>
        </form>
      </section>
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-extrabold text-primary">Advice</h2>
        {!result && !error && !busy && <p className="mt-3 text-muted-foreground">Your suggestions will appear here.</p>}
        {busy && <p className="mt-3 animate-pulse text-muted-foreground">Looking at your crop…</p>}
        {error && <p className="mt-3 text-destructive">{error}</p>}
        {result && <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{result.replace(/\*\*/g, "")}</div>}
        <p className="mt-6 text-xs text-muted-foreground">AI suggestions can be wrong. For serious problems, contact your local Krishi Vigyan Kendra or call 8050209899.</p>
      </section>
    </main>
  );
}
