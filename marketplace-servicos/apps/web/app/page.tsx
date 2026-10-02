import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const [
    { count: usersCount },
    { count: providersCount },
    { count: requestsCount },
    { count: reviewsCount },
  ] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("provider_profiles").select("id", { count: "exact", head: true }),
    supabase.from("service_requests").select("id", { count: "exact", head: true }),
    supabase.from("reviews").select("id", { count: "exact", head: true }),
  ]);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Dashboard — Marketplace de Serviços
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Usuários" value={usersCount ?? 0} icon="👤" />
        <StatCard title="Prestadores" value={providersCount ?? 0} icon="🔧" />
        <StatCard title="Solicitações" value={requestsCount ?? 0} icon="📋" />
        <StatCard title="Avaliações" value={reviewsCount ?? 0} icon="⭐" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentUsers supabase={supabase} />
        <RecentRequests supabase={supabase} />
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-gray-900">{value.toLocaleString("pt-BR")}</div>
      <div className="text-sm text-gray-500 mt-1">{title}</div>
    </div>
  );
}

async function RecentUsers({ supabase }: { supabase: ReturnType<typeof createServerComponentClient> }) {
  const { data: users } = await supabase
    .from("users")
    .select("id, name, email, role, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="font-semibold text-gray-800 mb-4">Usuários recentes</h2>
      <div className="space-y-3">
        {users?.map((u) => (
          <div key={u.id} className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-800">{u.name}</div>
              <div className="text-xs text-gray-500">{u.email}</div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              u.role === "provider"
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-600"
            }`}>
              {u.role === "provider" ? "Prestador" : "Cliente"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

async function RecentRequests({ supabase }: { supabase: ReturnType<typeof createServerComponentClient> }) {
  const { data: requests } = await supabase
    .from("service_requests")
    .select("id, raw_input, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const STATUS_LABELS: Record<string, string> = {
    pending: "Aguardando",
    matched: "Matched",
    negotiating: "Negociando",
    in_progress: "Em andamento",
    completed: "Concluído",
    cancelled: "Cancelado",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="font-semibold text-gray-800 mb-4">Solicitações recentes</h2>
      <div className="space-y-3">
        {requests?.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-700 truncate flex-1">
              {r.raw_input ?? "Solicitação de serviço"}
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {STATUS_LABELS[r.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
