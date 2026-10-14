import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Cart = Record<string, number>;
type Ctx = { items: Cart; count: number; add: (id: string) => void; setQty: (id: string, q: number) => void; clear: () => void };
const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Cart>({});
  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem("agrisetu-cart") || "{}")); } catch { /* ignore */ }
  }, []);
  const save = (next: Cart) => { setItems(next); localStorage.setItem("agrisetu-cart", JSON.stringify(next)); };
  const setQty = (id: string, q: number) => {
    const next = { ...items };
    if (q <= 0) delete next[id]; else next[id] = Math.min(q, 99);
    save(next);
  };
  const value: Ctx = {
    items,
    count: Object.values(items).reduce((a, b) => a + b, 0),
    add: (id) => setQty(id, (items[id] ?? 0) + 1),
    setQty,
    clear: () => save({}),
  };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
