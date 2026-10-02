/**
 * match-providers — Supabase Edge Function (Deno)
 *
 * Recebe uma solicitação de serviço e retorna uma lista ranqueada
 * de prestadores compatíveis usando:
 *   1. Busca geoespacial (ST_DWithin via find_providers_nearby)
 *   2. Busca semântica (pgvector cosine similarity)
 *   3. Score composto: relevância × proximidade × avaliação × disponibilidade
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Singleton para o modelo de embedding (warm entre invocações na mesma instância)
let embedder: ReturnType<typeof pipeline> | null = null;

async function getEmbedder() {
  if (!embedder) {
    embedder = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

async function generateEmbedding(text: string): Promise<number[]> {
  const pipe = await getEmbedder();
  const output = await (await pipe)(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}

interface MatchRequest {
  lat: number;
  lng: number;
  query_text?: string;       // texto livre do usuário
  category_id?: string;      // filtro opcional de categoria
  radius_km?: number;        // padrão 15
  limit?: number;            // padrão 10
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body: MatchRequest = await req.json();
    const { lat, lng, query_text, category_id, radius_km = 15, limit = 10 } = body;

    if (!lat || !lng) {
      return new Response(
        JSON.stringify({ error: "lat e lng são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Busca geoespacial base
    const { data: geoProviders, error: geoError } = await supabase.rpc(
      "find_providers_nearby",
      {
        lat,
        lng,
        radius_km,
        filter_category: category_id ?? null,
        result_limit: limit * 3, // pega mais para re-ranquear depois
      }
    );

    if (geoError) throw geoError;
    if (!geoProviders || geoProviders.length === 0) {
      return new Response(
        JSON.stringify({ providers: [], fallback: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let providers = geoProviders;

    // 2. Re-ranqueamento semântico (só se há texto livre)
    if (query_text && query_text.trim().length > 3) {
      const queryEmbedding = await generateEmbedding(query_text);

      // Busca por similaridade semântica no pgvector
      const { data: semanticResults } = await supabase.rpc(
        "match_providers_semantic",
        {
          query_embedding: queryEmbedding,
          match_threshold: 0.5,
          match_count: limit * 3,
        }
      );

      if (semanticResults && semanticResults.length > 0) {
        // Mapeia scores semânticos por provider_id
        const semanticScoreMap = new Map<string, number>(
          semanticResults.map((r: { provider_id: string; similarity: number }) => [
            r.provider_id,
            r.similarity,
          ])
        );

        // Score composto: geo + semântico + avaliação + disponibilidade
        providers = geoProviders
          .map((p: Record<string, unknown>) => {
            const semanticScore = semanticScoreMap.get(p.provider_id as string) ?? 0;
            const distanceScore = Math.max(0, 1 - (p.distance_km as number) / radius_km);
            const ratingScore = (p.avg_rating as number) / 5;
            const availabilityBonus = p.availability_status === "available_now" ? 0.2 : 0;

            const compositeScore =
              semanticScore * 0.4 +
              distanceScore * 0.3 +
              ratingScore * 0.2 +
              availabilityBonus * 0.1;

            return { ...p, composite_score: compositeScore };
          })
          .sort(
            (a: Record<string, unknown>, b: Record<string, unknown>) =>
              (b.composite_score as number) - (a.composite_score as number)
          )
          .slice(0, limit);
      }
    }

    // Limita resultado final
    const result = providers.slice(0, limit);

    return new Response(
      JSON.stringify({ providers: result, total: result.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("match-providers error:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno no matching" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
