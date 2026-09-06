import catalogData from "../src/data/product-catalog.json";
import { ProductSchema, type MealPlanRequest, type Product } from "../src/domain/meal-plan";

const catalog = ProductSchema.array().parse(catalogData);
const animalDepartments = new Set(["Meat", "Fish"]);
const veganDepartments = new Set(["Meat", "Fish", "Dairy & Eggs"]);
const animalAllergens = new Set(["milk", "eggs", "fish", "crustaceans", "molluscs"]);

function supportsDiet(product: Product, input: MealPlanRequest): boolean {
  const needs = new Set(input.dietaryNeeds);
  if (needs.has("gluten-free") && product.allergens.includes("gluten")) return false;
  if (needs.has("dairy-free") && product.allergens.includes("milk")) return false;
  if (needs.has("vegetarian") && animalDepartments.has(product.department)) return false;
  if (needs.has("pescatarian") && product.department === "Meat") return false;
  if (needs.has("vegan")) {
    if (veganDepartments.has(product.department)) return false;
    if (product.allergens.some((allergen) => animalAllergens.has(allergen))) return false;
  }
  return true;
}

function supportsGoals(product: Product, input: MealPlanRequest): boolean {
  const goals = new Set(input.nutritionalGoals);
  const nutrition = product.nutrition;

  if (goals.has("high-protein") && (nutrition.proteins100g === null || nutrition.proteins100g < 8)) return false;
  if (goals.has("low-sugar") && (nutrition.sugars100g === null || nutrition.sugars100g > 8)) return false;
  if (goals.has("low-fat") && (nutrition.fat100g === null || nutrition.fat100g > 12)) return false;
  if (goals.has("low-carbs") && (nutrition.carbohydrates100g === null || nutrition.carbohydrates100g > 30)) return false;
  if (goals.has("low-salt") && (nutrition.salt100g === null || nutrition.salt100g > 0.8)) return false;
  return true;
}

function score(product: Product, input: MealPlanRequest): number {
  const goals = new Set(input.nutritionalGoals);
  const nutrition = product.nutrition;
  let value = product.price * 2;

  if (goals.has("high-protein")) value -= nutrition.proteins100g ?? 0;
  if (goals.has("low-sugar")) value += nutrition.sugars100g ?? 20;
  if (goals.has("low-fat")) value += nutrition.fat100g ?? 20;
  if (goals.has("low-carbs")) value += (nutrition.carbohydrates100g ?? 60) / 2;
  if (goals.has("low-salt")) value += (nutrition.salt100g ?? 3) * 5;
  return value;
}

export function selectCandidateProducts(input: MealPlanRequest): Product[] {
  const filtered = catalog
    .filter((product) => product.price <= input.weeklyBudget * 0.35)
    .filter((product) => supportsDiet(product, input))
    .filter((product) => supportsGoals(product, input));

  if (filtered.length < 24) {
    throw new Error("The selected preference combination leaves too few catalog products to create a reliable plan.");
  }

  const byDepartment = new Map<string, Product[]>();
  for (const product of filtered) {
    const group = byDepartment.get(product.department) ?? [];
    group.push(product);
    byDepartment.set(product.department, group);
  }

  const shortlist = [...byDepartment.values()].flatMap((products) =>
    products.sort((left, right) => score(left, input) - score(right, input)).slice(0, 6),
  );

  return shortlist.sort((left, right) => score(left, input) - score(right, input)).slice(0, 72);
}

export function getCatalogSize() {
  return catalog.length;
}

