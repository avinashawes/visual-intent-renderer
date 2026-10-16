import { describe, expect, it } from "vitest";
import { estimatedValue, findMsp } from "./msp";

describe("MSP selling", () => {
  it("uses verified paddy common MSP", () => expect(findMsp("Paddy (Common)")?.price).toBe(2441));
  it("uses verified wheat MSP", () => expect(findMsp("Wheat")?.price).toBe(2585));
  it("does not give vegetables an MSP", () => expect(findMsp("Tomato")).toBeNull());
  it("converts tonnes to quintals", () => expect(estimatedValue(2, "tonne", 2441)).toBe(48820));
});