import { describe, it, expect } from "vitest";
import { cartTotals } from "./products";

describe("cartTotals", () => {
  it("adds 5% GST", () => expect(cartTotals(1000).gst).toBe(50));
  it("charges ₹50 delivery at or below ₹999", () => expect(cartTotals(999).delivery).toBe(50));
  it("free delivery above ₹999", () => expect(cartTotals(1000).delivery).toBe(0));
  it("total = subtotal + gst + delivery", () => expect(cartTotals(320).total).toBe(320 + 16 + 50));
});
