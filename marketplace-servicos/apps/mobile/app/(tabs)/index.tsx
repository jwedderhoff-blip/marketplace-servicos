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
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useLocation } from "../../hooks/useLocation";
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

export default function PracaVirtualScreen() {
  const { coords, loading: locationLoading } = useLocation();
  const [providers, setProviders] = useState<ProviderNearby[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    if (!coords) return;

    const { data, error } = await supabase.rpc("find_providers_nearby", {
      lat: coords.lat,
      lng: coords.lng,
      radius_km: 15,
      filter_category: selectedCategory,
      result_limit: 30,
    });

    if (!error && data) {
      setProviders(data);
    }
    setLoading(false);
    setRefreshing(false);
  }, [coords, selectedCategory]);

  useEffect(() => {
    if (coords) {
      setLoading(true);
      loadProviders();
    }
  }, [coords, selectedCategory]);

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

  if (locationLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Buscando sua localização...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Praça de Serviços</Text>
        <Text style={styles.headerSubtitle}>
          {providers.length > 0
            ? `${providers.length} prestadores próximos`
            : "Carregando..."}
        </Text>
      </View>

      {/* Barra de busca */}
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
              <Section title="🆕 Novos na praça" providers={newest} />
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
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={providers}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.provider_id}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        renderItem={({ item }) => (
          <ProviderCard
            provider={item}
            onPress={() =>
              router.push({
                pathname: "/provider/[id]",
                params: { id: item.provider_id },
              })
            }
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
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
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 16,
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
});
