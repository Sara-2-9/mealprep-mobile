import { describe, expect, test } from "bun:test";

import { selectCandidateProducts } from "../server/catalog";

describe("catalog candidate selection", () => {
  test("respects vegan and gluten-free exclusions", () => {
    const products = selectCandidateProducts({
      weeklyBudget: 82,
      dietaryNeeds: ["vegan", "gluten-free"],
      nutritionalGoals: ["none"],
    });

    expect(products.length).toBeGreaterThanOrEqual(24);
    expect(products.every((product) => !["Meat", "Fish", "Dairy & Eggs"].includes(product.department))).toBe(true);
    expect(products.every((product) => !product.allergens.some((allergen) => ["gluten", "milk", "eggs", "fish"].includes(allergen)))).toBe(true);
  });

  test("requires known protein values for high-protein plans", () => {
    const products = selectCandidateProducts({
      weeklyBudget: 100,
      dietaryNeeds: ["none"],
      nutritionalGoals: ["high-protein"],
    });

    expect(products.every((product) => (product.nutrition.proteins100g ?? -1) >= 8)).toBe(true);
  });

  test("keeps each candidate proportionate to the weekly budget", () => {
    const products = selectCandidateProducts({
      weeklyBudget: 25,
      dietaryNeeds: ["none"],
      nutritionalGoals: ["none"],
    });

    expect(products.every((product) => product.price <= 8.75)).toBe(true);
  });
});

