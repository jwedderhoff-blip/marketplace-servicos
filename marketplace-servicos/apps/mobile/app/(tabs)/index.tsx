import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
// import { useLocation } from "../../hooks/useLocation"; // desabilitado para testes web
import { Colors } from "../../constants/colors";
import type { ProviderNearby, AvailabilityStatus } from "../../lib/database.types";
import { ProviderCard } from "../../components/ProviderCard";
import { CategoryChip } from "../../components/CategoryChip";
import { AvailabilityDot } from "../../components/AvailabilityDot";

const CATEGORY_FILTERS = [
  { id: null, label: "Todos" },
  { id: "a1000000-0000-0000-0000-000000000013", label: "Elétrica" },
  { id: "a1000000-0000-0000-0000-000000000010", label: "Cozinha" },
  { id: "a1000000-0000-0000-0000-000000000011", label: "Banheiro" },
  { id: "a1000000-0000-0000-0000-000000000012", label: "Área Externa" },
  { id: "a1000000-0000-0000-0000-000000000014", label: "Pintura" },
  { id: "a1000000-0000-0000-0000-000000000015", label: "Climatização" },
  { id: "a1000000-0000-0000-0000-000000000016", label: "Reforma" },
];

const SAO_PAULO = { lat: -23.5505, lng: -46.6333 };

export default function PracaVirtualScreen() {
  // const { coords, loading: locationLoading } = useLocation(); // desabilitado para testes web
  const [providers, setProviders] = useState<ProviderNearby[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"sections" | "grid">("sections");

  // Supabase Realtime — atualiza status de disponibilidade sem polling
  useEffect(() => {
    const channel = supabase
      .channel("praca-availability")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "provider_profiles",
          filter: "availability_status=neq.unavailable",
        },
        (payload) => {
          setProviders((prev) =>
            prev.map((p) =>
              p.provider_id === payload.new.id
                ? { ...p, availability_status: payload.new.availability_status as AvailabilityStatus }
                : p
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadProviders = useCallback(async () => {
    // const location = coords ?? SAO_PAULO; // reativar quando useLocation estiver habilitado
    const location = SAO_PAULO;

    const { data, error } = await supabase.rpc("find_providers_nearby", {
      lat: location.lat,
      lng: location.lng,
      radius_km: 50,
      filter_category: selectedCategory,
      result_limit: 30,
    });

    if (!error && data) {
      setProviders(data);
    }
    setLoading(false);
    setRefreshing(false);
  }, [selectedCategory]); // adicionar coords nas deps ao reativar useLocation

  useEffect(() => {
    loadProviders();
  }, [selectedCategory]); // adicionar coords nas deps ao reativar useLocation

  const onRefresh = () => {
    setRefreshing(true);
    loadProviders();
  };

  // Seções da praça
  const availableNow = providers.filter(
    (p) => p.availability_status === "available_now"
  );
  const topRated = [...providers]
    .sort((a, b) => b.avg_rating - a.avg_rating)
    .slice(0, 8);
  const newest = providers.slice(-6).reverse();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header com gradiente */}
      <LinearGradient
        colors={["#3A0CA3", "#6C3DE0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Platz</Text>
            <Text style={styles.headerSubtitle}>
              {providers.length > 0
                ? `${providers.length} prestadores próximos`
                : "Buscando prestadores..."}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <TouchableOpacity
              style={styles.viewToggle}
              onPress={() =>
                setViewMode((v) => (v === "sections" ? "grid" : "sections"))
              }
            >
              <Text style={styles.viewToggleText}>
                {viewMode === "sections" ? "⊞" : "☰"}
              </Text>
            </TouchableOpacity>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>📍 SP</Text>
            </View>
          </View>
        </View>

        {/* Barra de busca dentro do gradiente */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="O que você precisa hoje?"
              placeholderTextColor={Colors.textDisabled}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => {
                if (searchQuery.trim()) {
                  router.push({
                    pathname: "/(tabs)/search",
                    params: { query: searchQuery },
                  });
                }
              }}
              returnKeyType="search"
            />
          </View>
        </View>
      </LinearGradient>

      {/* Filtros de categoria */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {CATEGORY_FILTERS.map((filter) => (
          <CategoryChip
            key={filter.id ?? "all"}
            label={filter.label}
            selected={selectedCategory === filter.id}
            onPress={() => setSelectedCategory(filter.id)}
          />
        ))}
      </ScrollView>

      {/* Conteúdo principal */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : providers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>Nenhum prestador encontrado</Text>
            <Text style={styles.emptyText}>
              Tente ampliar o raio de busca ou remover filtros
            </Text>
          </View>
        ) : viewMode === "grid" ? (
          <>
            <View style={styles.gridHeader}>
              <Text style={styles.sectionTitle}>Todos os prestadores</Text>
              <Text style={styles.gridCount}>{providers.length} encontrados</Text>
            </View>
            <View style={styles.gridContainer}>
              {providers.map((p) => (
                <ProviderCard
                  key={p.provider_id}
                  provider={p}
                  onPress={() => router.push(`/provider/${p.provider_id}`)}
                />
              ))}
            </View>
            <View style={{ height: 32 }} />
          </>
        ) : (
          <>
            {/* Disponíveis agora */}
            {availableNow.length > 0 && (
              <Section
                title="✦ Disponíveis agora perto de você"
                providers={availableNow}
              />
            )}

            {/* Mais bem avaliados */}
            {topRated.length > 0 && (
              <Section title="⭐ Mais bem avaliados" providers={topRated} />
            )}

            {/* Novos na praça */}
            {newest.length > 0 && (
              <Section title="🆕 Novos no Platz" providers={newest} />
            )}

            <View style={{ height: 32 }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  providers,
}: {
  title: string;
  providers: ProviderNearby[];
}) {
  const flatListRef = useRef<FlatList<ProviderNearby>>(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    if (providers.length <= 1) return;
    const id = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % providers.length;
      flatListRef.current?.scrollToIndex({
        index: currentIndex.current,
        animated: true,
      });
    }, 3000);
    return () => clearInterval(id);
  }, [providers.length]);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        ref={flatListRef}
        data={providers}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.provider_id}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        onScrollToIndexFailed={() => {
          currentIndex.current = 0;
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }}
        renderItem={({ item }) => (
          <ProviderCard
            provider={item}
            onPress={() => router.push(`/provider/${item.provider_id}`)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 40,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  headerGradient: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  headerBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  headerBadgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 14,
    paddingHorizontal: 16,
    letterSpacing: -0.2,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  viewToggle: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  viewToggleText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },
  gridHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  gridCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 12,
    justifyContent: "center",
  },
});
