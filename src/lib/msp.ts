export type ProduceType = "crop" | "vegetable" | "grain";
export type MspEntry = { name: string; type: ProduceType; price: number; season: string; source: string };

const kharif = "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2260618";
export const mspCrops: MspEntry[] = [
  { name: "Paddy (Common)", type: "grain", price: 2441, season: "Kharif Marketing Season 2026-27", source: kharif },
  { name: "Maize", type: "grain", price: 2410, season: "Kharif Marketing Season 2026-27", source: kharif },
  { name: "Ragi", type: "grain", price: 5205, season: "Kharif Marketing Season 2026-27", source: kharif },
  { name: "Wheat", type: "grain", price: 2585, season: "Rabi Marketing Season 2026-27", source: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2173566" },
];

export function findMsp(name: string) {
  return mspCrops.find((c) => c.name === name) ?? null;
}

export function estimatedValue(quantity: number, unit: "quintal" | "kg" | "tonne", pricePerQuintal: number) {
  const quintals = unit === "kg" ? quantity / 100 : unit === "tonne" ? quantity * 10 : quantity;
  return Math.round(quintals * pricePerQuintal * 100) / 100;
}