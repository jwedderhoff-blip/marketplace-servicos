import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useLocation } from "../../hooks/useLocation";
import { Colors } from "../../constants/colors";
import type { ProviderNearby } from "../../lib/database.types";
import { ProviderCard } from "../../components/ProviderCard";

export default function SearchScreen() {
  const params = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(params.query ?? "");
  const [results, setResults] = useState<ProviderNearby[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { coords } = useLocation();

  const handleSearch = async () => {
    if (!query.trim() || !coords) return;
    setLoading(true);
    setSearched(true);

    try {
      // Chama a Edge Function de matching semântico
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/match-providers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            lat: coords.lat,
            lng: coords.lng,
            query_text: query,
            radius_km: 15,
            limit: 20,
          }),
        }
      );

      const json = await res.json();
      setResults(json.providers ?? []);
    } catch {
      // fallback: busca geoespacial pura
      const { data } = await supabase.rpc("find_providers_nearby", {
        lat: coords.lat,
        lng: coords.lng,
        radius_km: 15,
        result_limit: 20,
      });
      setResults(data ?? []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>Buscar Serviço</Text>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Ex: minha geladeira não está gelando"
          placeholderTextColor={Colors.textDisabled}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          multiline={false}
        />
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={styles.searchBtnText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ marginTop: 40 }}
        />
      )}

      {!loading && searched && results.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🤷</Text>
          <Text style={styles.emptyTitle}>Nenhum resultado encontrado</Text>
          <Text style={styles.emptyText}>
            Tente descrever o problema de outra forma
          </Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.provider_id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={styles.list}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  title: { fontSize: 22, fontWeight: "700", color: Colors.text, marginBottom: 16 },
  searchBar: { flexDirection: "row", gap: 8, marginBottom: 16 },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
  },
  searchBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  searchBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  list: { paddingBottom: 32 },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: "600", color: Colors.text },
  emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: "center" },
});
