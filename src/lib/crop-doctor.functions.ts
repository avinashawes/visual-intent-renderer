import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  crop: z.string().trim().max(80),
  problem: z.string().trim().min(5).max(2000),
  image: z.string().max(7_000_000).regex(/^data:image\/(png|jpe?g|webp);base64,/).nullable(),
});

const SYSTEM = `You are an agronomist helping small farmers in India (Karnataka). Given a crop problem description and optionally a photo, reply in simple English with these sections in markdown:
**Likely causes** (2-4, most likely first, with a short reason each)
**What to do now** (practical numbered steps, organic options first, then chemical with common product types and safe dosage guidance)
**Prevention**
**When to get expert help**
Be honest when the photo is unclear. Keep it under 300 words.`;

export const diagnoseCrop = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false as const, error: "Crop Doctor is not configured yet." };
    const content: Array<Record<string, string>> = [
      { type: "input_text", text: `Crop: ${data.crop || "not specified"}\nProblem: ${data.problem}` },
    ];
    if (data.image) content.push({ type: "input_image", image_url: data.image });

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions: SYSTEM,
        input: [{ role: "user", content }],
        reasoning: { effort: "low" },
        store: false,
        stream: true,
      }),
    });
    if (!res.ok || !res.body) {
      const msg = res.status === 429 ? "Too many requests right now — please try again in a minute."
        : res.status === 402 ? "AI credits have run out. Please contact the site owner."
        : "Could not analyse right now. Please try again.";
      console.error("crop-doctor gateway", res.status, await res.text().catch(() => ""));
      return { ok: false as const, error: msg };
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "", text = "", refused = false;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf("\n\n")) >= 0) {
        const frame = buf.slice(0, i); buf = buf.slice(i + 2);
        for (const line of frame.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const p = line.slice(5).trim();
          if (!p || p === "[DONE]") continue;
          try {
            const ev = JSON.parse(p);
            if (ev.type === "response.output_text.delta") text += ev.delta;
            if (ev.type === "response.refusal.delta") refused = true;
          } catch { /* partial */ }
        }
      }
    }
    if (refused || !text.trim()) return { ok: false as const, error: "No suggestion could be generated for this request." };
    return { ok: true as const, text };
  });
