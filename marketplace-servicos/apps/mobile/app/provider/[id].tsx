import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Colors } from "../../constants/colors";
import { AvailabilityDot } from "../../components/AvailabilityDot";
import type { ProviderProfile, User, ProviderService, Tag, Review } from "../../lib/database.types";

interface ProviderDetail extends ProviderProfile {
  users: User;
  provider_services: Array<ProviderService & { tags: Tag }>;
  reviews: Review[];
}

const AVAILABILITY_LABELS = {
  available_now: "Disponível agora",
  available_today: "Disponível hoje",
  unavailable: "Indisponível",
};

export default function ProviderProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [provider, setProvider] = useState<ProviderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  useEffect(() => {
    if (!id) return;

    supabase
      .from("provider_profiles")
      .select(`
        *,
        users (*),
        provider_services (*, tags (*)),
        reviews!inner (*)
      `)
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setProvider(data as ProviderDetail);
        setLoading(false);
      });
  }, [id]);

  const handleRequestService = () => {
    if (!provider) return;
    router.push({
      pathname: "/request/new",
      params: { provider_id: provider.id },
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!provider) {
    return (
      <View style={styles.centered}>
        <Text>Prestador não encontrado</Text>
      </View>
    );
  }

  const user = provider.users;
  const reviews = provider.reviews ?? [];
  const services = provider.provider_services ?? [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Foto de perfil e info básica */}
      <View style={styles.heroSection}>
        <View style={styles.avatarWrapper}>
          {user.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitial}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <AvailabilityDot status={provider.availability_status} size={18} />
        </View>

        <Text style={styles.name}>{user.name}</Text>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  provider.availability_status === "available_now"
                    ? Colors.availableNow + "20"
                    : provider.availability_status === "available_today"
                    ? Colors.availableToday + "20"
                    : Colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    provider.availability_status === "available_now"
                      ? Colors.availableNow
                      : provider.availability_status === "available_today"
                      ? Colors.availableToday
                      : Colors.textSecondary,
                },
              ]}
            >
              {AVAILABILITY_LABELS[provider.availability_status]}
            </Text>
          </View>

          {provider.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verificado</Text>
            </View>
          )}
        </View>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.ratingValue}>
            {provider.avg_rating > 0
              ? provider.avg_rating.toFixed(1)
              : "Sem avaliações"}
          </Text>
          {provider.total_reviews > 0 && (
            <Text style={styles.ratingCount}>
              ({provider.total_reviews} avaliações)
            </Text>
          )}
        </View>

        {/* Raio de atendimento */}
        <Text style={styles.radius}>
          📍 Atende num raio de {provider.service_radius_km} km
        </Text>
      </View>

      {/* Bio */}
      {provider.bio && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.bio}>{provider.bio}</Text>
        </View>
      )}

      {/* Portfólio de fotos */}
      {provider.portfolio_photos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trabalhos realizados</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.portfolioRow}>
              {provider.portfolio_photos.map((url, index) => (
                <TouchableOpacity
                  key={url}
                  onPress={() => setSelectedPhoto(index)}
                >
                  <Image source={{ uri: url }} style={styles.portfolioThumb} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Serviços */}
      {services.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços</Text>
          {services.map((service) => (
            <View key={service.id} style={styles.serviceRow}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>
                  {service.tags?.name ?? "Serviço"}
                </Text>
                {service.custom_description && (
                  <Text style={styles.serviceDesc} numberOfLines={2}>
                    {service.custom_description}
                  </Text>
                )}
              </View>
              {service.price_range_min && (
                <Text style={styles.servicePrice}>
                  R$ {service.price_range_min.toLocaleString("pt-BR")}
                  {service.price_range_max &&
                    ` – ${service.price_range_max.toLocaleString("pt-BR")}`}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Avaliações recentes */}
      {reviews.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avaliações</Text>
          {reviews.slice(0, 3).map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewRating}>
                  {"⭐".repeat(review.rating)}
                </Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.created_at).toLocaleDateString("pt-BR")}
                </Text>
              </View>
              {review.comment && (
                <Text style={styles.reviewComment}>{review.comment}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 100 }} />

      {/* Botão fixo de ação */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleRequestService}
          disabled={provider.availability_status === "unavailable"}
        >
          <Text style={styles.ctaText}>
            {provider.availability_status === "unavailable"
              ? "Prestador indisponível"
              : "Solicitar serviço"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  heroSection: {
    alignItems: "center",
    padding: 24,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarWrapper: { position: "relative", marginBottom: 12 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarFallback: {
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { fontSize: 42, fontWeight: "700", color: Colors.primary },
  name: { fontSize: 22, fontWeight: "700", color: Colors.text, marginBottom: 8 },
  statusRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 13, fontWeight: "600" },
  verifiedBadge: {
    backgroundColor: Colors.success + "20",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  verifiedText: { fontSize: 13, fontWeight: "600", color: Colors.success },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 6 },
  star: { fontSize: 14 },
  ratingValue: { fontSize: 16, fontWeight: "700", color: Colors.text },
  ratingCount: { fontSize: 13, color: Colors.textSecondary },
  radius: { fontSize: 13, color: Colors.textSecondary },
  section: { padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: Colors.text, marginBottom: 12 },
  bio: { fontSize: 15, color: Colors.text, lineHeight: 22 },
  portfolioRow: { flexDirection: "row", gap: 8 },
  portfolioThumb: {
    width: 120,
    height: 90,
    borderRadius: 8,
    backgroundColor: Colors.border,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  serviceInfo: { flex: 1, marginRight: 8 },
  serviceName: { fontSize: 15, fontWeight: "600", color: Colors.text, marginBottom: 2 },
  serviceDesc: { fontSize: 13, color: Colors.textSecondary },
  servicePrice: { fontSize: 14, fontWeight: "600", color: Colors.primary },
  reviewCard: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  reviewRating: { fontSize: 13 },
  reviewDate: { fontSize: 12, color: Colors.textSecondary },
  reviewComment: { fontSize: 14, color: Colors.text, lineHeight: 20 },
  ctaContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
