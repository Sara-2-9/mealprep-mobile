import { ZodError } from "zod";

import { getCatalogSize } from "./catalog";
import { generateMealPlan } from "./meal-plan";

const port = Number(Bun.env.API_PORT ?? 3000);
const corsHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

function upstreamErrorResponse(error: unknown) {
  const status =
    typeof error === "object" && error !== null
      ? "statusCode" in error
        ? Number(error.statusCode)
        : "status" in error
          ? Number(error.status)
          : undefined
      : undefined;
  if (status === 401 || status === 403) {
    return { clientMessage: "The configured LLM workflow could not authenticate.", logMessage: `LLM authentication failed (${status}).` };
  }
  if (status === 429) {
    return { clientMessage: "The LLM workflow is temporarily unavailable. Please retry later.", logMessage: "LLM rate limit reached (429)." };
  }
  return { clientMessage: "Meal plan generation failed. Please retry.", logMessage: "Meal plan generation failed." };
}

const server = Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders, status: 204 });

    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ catalogSize: getCatalogSize(), status: "ok" }, { headers: corsHeaders });
    }

    if (request.method === "POST" && url.pathname === "/meal-plan") {
      try {
        const plan = await generateMealPlan(await request.json(), request.signal);
        return Response.json(plan, { headers: corsHeaders });
      } catch (error) {
        const clientError = error instanceof ZodError;
        const upstreamError = upstreamErrorResponse(error);
        console.error(`[meal-plan] ${clientError ? "Invalid request payload." : upstreamError.logMessage}`);
        return Response.json(
          { error: clientError ? "The meal plan request was invalid." : upstreamError.clientMessage },
          { headers: corsHeaders, status: clientError ? 400 : 502 },
        );
      }
    }

    return Response.json({ error: "Not found." }, { headers: corsHeaders, status: 404 });
  },
});

console.log(`MealPrep API listening on http://localhost:${server.port}`);
