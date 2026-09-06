import { dirname, join } from "node:path";

const sourcePath = join(import.meta.dir, "../blackboard-mobile-engineer-take-home/product_catalog_en.json");
const outputPath = join(import.meta.dir, "../src/data/product-catalog.json");

const allergenNames: Record<string, string> = {
  Arachidi: "peanuts",
  Crostacei: "crustaceans",
  "Frutta a guscio": "tree-nuts",
  Glutine: "gluten",
  Latte: "milk",
  Lupini: "lupin",
  Molluschi: "molluscs",
  Pesce: "fish",
  Sedano: "celery",
  Senape: "mustard",
  Sesamo: "sesame",
  Soia: "soy",
  Solfiti: "sulphites",
  Uova: "eggs",
};

type SourceProduct = {
  id: string;
  name: string;
  department: { name: string };
  category: { name: string | null } | null;
  price: { amount: number; currency: "EUR" };
  labels: { name: string }[];
  allergens: { name: string }[];
  nutrition: Record<string, number | null>;
};

const source = (await Bun.file(sourcePath).json()) as SourceProduct[];
const numeric = (value: number | null | undefined) => value ?? null;

const products = source.map((product) => ({
  id: product.id,
  name: product.name,
  category: product.category?.name ?? "Uncategorized",
  department: product.department.name,
  price: product.price.amount,
  currency: product.price.currency,
  labels: product.labels.map((label) => label.name),
  allergens: product.allergens.map((allergen) => allergenNames[allergen.name] ?? allergen.name.toLowerCase()),
  nutrition: {
    energyKcal100g: numeric(product.nutrition.energyKcal100g),
    fat100g: numeric(product.nutrition.fat100g),
    saturatedFat100g: numeric(product.nutrition.saturatedFat100g),
    carbohydrates100g: numeric(product.nutrition.carbohydrates100g),
    sugars100g: numeric(product.nutrition.sugars100g),
    fiber100g: numeric(product.nutrition.fiber100g),
    proteins100g: numeric(product.nutrition.proteins100g),
    salt100g: numeric(product.nutrition.salt100g),
  },
}));

await Bun.write(outputPath, JSON.stringify(products));
console.log(`Wrote ${products.length} normalized products to ${outputPath.replace(`${dirname(import.meta.dir)}/`, "")}.`);
