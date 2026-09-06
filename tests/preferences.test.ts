import { describe, expect, test } from "bun:test";

import { toggleExclusiveNone } from "../src/domain/preferences";

describe("toggleExclusiveNone", () => {
  test("selecting none clears other values", () => {
    expect(toggleExclusiveNone(["vegan", "gluten-free"], "none")).toEqual(["none"]);
  });

  test("selecting a preference removes none", () => {
    expect(toggleExclusiveNone(["none"], "vegan")).toEqual(["vegan"]);
  });

  test("selecting an active preference toggles it off", () => {
    expect(toggleExclusiveNone(["vegan", "gluten-free"], "vegan")).toEqual(["gluten-free"]);
  });
});

