/**
 * update-embedding — Supabase Edge Function (Deno)
 *
 * Chamada via Supabase Database Webhook quando um provider_profile é
 * criado ou atualizado, para regenerar o embedding semântico do perfil.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";

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

serve(async (req: Request) => {
  try {
    const { record } = await req.json();
    if (!record?.id) return new Response("ok");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Coleta informações do prestador para compor o texto de embedding
    const { data: profile } = await supabase
      .from("provider_profiles")
      .select(`
        bio,
        provider_services (
          custom_description,
          tags ( name, slug )
        )
      `)
      .eq("id", record.id)
      .single();

    if (!profile) return new Response("profile not found", { status: 404 });

    // Compõe texto representativo do prestador
    const serviceTags = profile.provider_services
      ?.flatMap((s: Record<string, unknown>) => {
        const tag = s.tags as { name: string; slug: string } | null;
        return tag ? [tag.name, tag.slug.replace(/-/g, " ")] : [];
      })
      .join(", ") ?? "";

    const embeddingText = [
      profile.bio ?? "",
      serviceTags,
    ]
      .filter(Boolean)
      .join(". ")
      .slice(0, 512); // limita tamanho para o modelo

    if (!embeddingText.trim()) return new Response("no text to embed");

    const embedding = await generateEmbedding(embeddingText);

    await supabase
      .from("provider_profiles")
      .update({ embedding, updated_at: new Date().toISOString() })
      .eq("id", record.id);

    return new Response(JSON.stringify({ success: true, provider_id: record.id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("update-embedding error:", error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
});
