import { describe, expect, test } from "bun:test";

import { resolveApiBaseUrl } from "../src/services/api-base-url";

describe("resolveApiBaseUrl", () => {
  test("uses the Metro LAN host for a local development API", () => {
    expect(resolveApiBaseUrl("http://localhost:3000", "192.168.1.42:8081")).toBe(
      "http://192.168.1.42:3000",
    );
  });

  test("keeps explicitly configured remote APIs unchanged", () => {
    expect(resolveApiBaseUrl("https://api.mealprep.test", "192.168.1.42:8081")).toBe(
      "https://api.mealprep.test",
    );
  });

  test("keeps localhost when Metro does not publish a reachable LAN host", () => {
    expect(resolveApiBaseUrl("http://localhost:3000", "localhost:8081")).toBe(
      "http://localhost:3000",
    );
  });
});
