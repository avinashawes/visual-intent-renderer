import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";

export function SiteHeader() {
  const { count } = useCart();
  const [name, setName] = useState<string | null>(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      if (!u) return setName(null);
      const { data: p } = await supabase.from("profiles").select("full_name").eq("id", u.id).maybeSingle();
      setName(p?.full_name || u.email || "Farmer");
    };
    load();
    const { data: sub } = supabase.auth.onAuthStateChange((e) => {
      if (e === "SIGNED_IN" || e === "SIGNED_OUT" || e === "USER_UPDATED") load();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const nav = [
    { to: "/", label: "Shop" },
    { to: "/sell", label: "Sell Produce" },
    { to: "/crop-doctor", label: "Crop Doctor" },
    { to: "/schemes", label: "Govt Schemes" },
  ] as const;

  return (
    <>
      <div className="bg-primary py-2 text-center text-sm font-medium text-primary-foreground">
        🚚 Free delivery on orders above ₹999 · Expert helpline 1800-180-1551
      </div>
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="leading-none">
            <span className="text-2xl font-extrabold tracking-wide text-primary">AGRISETU</span>
            <span className="block text-[0.65rem] font-bold uppercase text-accent">Smart Farming</span>
          </Link>
          <nav className="hidden gap-7 font-semibold md:flex">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: true }} activeProps={{ className: "border-accent text-primary" }} className="border-b-2 border-transparent py-1 transition hover:border-accent hover:text-primary">{n.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <Link to="/cart" aria-label="Cart" className="relative text-xl">🛒
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">{count}</span>
            </Link>
            {name ? (
              <div className="flex items-center gap-3 text-sm">
                <span className="hidden font-semibold sm:inline">Hi, {name}</span>
                <button onClick={signOut} className="rounded-full bg-muted px-4 py-2 font-semibold transition hover:bg-secondary hover:text-secondary-foreground">Sign out</button>
              </div>
            ) : (
              <Link to="/auth" className="rounded-full bg-muted px-4 py-2 text-sm font-semibold transition hover:bg-secondary hover:text-secondary-foreground">👤 Login</Link>
            )}
          </div>
        </div>
        <nav className="flex justify-center gap-5 border-t border-border py-2 text-sm font-semibold md:hidden">
          {nav.map((n) => <Link key={n.to} to={n.to}>{n.label}</Link>)}
        </nav>
      </header>
    </>
  );
}
