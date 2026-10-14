import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Sign up – AGRISETU" },
      { name: "description", content: "Sign in to your AgriSetu farmer account or create a new one." },
      { property: "og:title", content: "Login – AGRISETU" },
      { property: "og:description", content: "Sign in or create your AgriSetu account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg(null);
    if (mode === "up") {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { full_name: name.trim() } } });
      setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Account created! Check your email to confirm, then sign in." });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg({ ok: false, text: error.message }); else navigate({ to: "/" });
    }
    setBusy(false);
  };

  const google = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) setMsg({ ok: false, text: String(r.error.message ?? r.error) });
    else if (!r.redirected) navigate({ to: "/" });
  };

  const input = "w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring";
  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
        <h1 className="text-3xl font-extrabold text-primary">{mode === "in" ? "Welcome back" : "Create account"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{mode === "in" ? "Sign in to continue shopping" : "Join thousands of farmers on AgriSetu"}</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "up" && (
            <label className="block text-sm font-semibold">Full name
              <input required minLength={2} maxLength={80} value={name} onChange={(e) => setName(e.target.value)} className={`${input} mt-1`} />
            </label>
          )}
          <label className="block text-sm font-semibold">Email
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${input} mt-1`} />
          </label>
          <label className="block text-sm font-semibold">Password
            <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={`${input} mt-1`} />
          </label>
          {msg && <p className={`text-sm ${msg.ok ? "text-primary" : "text-destructive"}`}>{msg.text}</p>}
          <button disabled={busy} className="w-full rounded-full bg-primary py-3 font-bold text-primary-foreground disabled:opacity-60">{busy ? "Please wait…" : mode === "in" ? "Sign in" : "Sign up"}</button>
        </form>
        <div className="my-5 text-center text-xs uppercase text-muted-foreground">or</div>
        <button onClick={google} className="w-full rounded-full border border-border py-3 font-semibold">Continue with Google</button>
        <p className="mt-6 text-center text-sm">
          {mode === "in" ? "New here? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }} className="font-bold text-primary">{mode === "in" ? "Create an account" : "Sign in"}</button>
        </p>
      </div>
    </main>
  );
}
