import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/colors";
import type { ProviderNearby } from "../lib/database.types";

interface ProviderCardProps {
  provider: ProviderNearby;
  onPress: () => void;
}

const STATUS_CONFIG = {
  available_now: {
    color: Colors.availableNow,
    label: "Disponível agora",
    gradient: ["#10B981", "#059669"] as const,
  },
  available_today: {
    color: Colors.availableToday,
    label: "Hoje",
    gradient: ["#F59E0B", "#D97706"] as const,
  },
  unavailable: {
    color: Colors.unavailable,
    label: "Indisponível",
    gradient: ["#9CA3AF", "#6B7280"] as const,
  },
} as const;

export function ProviderCard({ provider, onPress }: ProviderCardProps) {
  const mainService = provider.services?.[0];
  const status = STATUS_CONFIG[provider.availability_status] ?? STATUS_CONFIG.unavailable;

  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 14, stiffness: 200 });
    shadowOpacity.value = withSpring(0.22, { damping: 14 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 160 });
    shadowOpacity.value = withSpring(0.1, { damping: 12 });
  };

  const CardWrapper = Platform.OS === "web" ? View : Animated.View;
  const wrapperStyle = Platform.OS === "web" ? styles.shadow : [styles.shadow, animStyle];

  return (
    <CardWrapper style={wrapperStyle}>
      <Pressable
        style={styles.card}
        onPress={onPress}
        onPressIn={Platform.OS !== "web" ? handlePressIn : undefined}
        onPressOut={Platform.OS !== "web" ? handlePressOut : undefined}
      >
        {/* Status badge */}
        {provider.availability_status === "available_now" && (
          <LinearGradient
            colors={status.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.badge}
          >
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>{status.label}</Text>
          </LinearGradient>
        )}

        {/* Avatar com anel gradiente */}
        <View style={styles.avatarWrapper}>
          <LinearGradient
            colors={["#6C3DE0", "#8B5CF6", "#F59E0B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <View style={styles.avatarInner}>
              {provider.avatar_url ? (
                <Image source={{ uri: provider.avatar_url }} style={styles.avatar} />
              ) : (
                <LinearGradient
                  colors={[Colors.primaryLight, "#D8D0F8"]}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarInitial}>
                    {provider.name?.charAt(0).toUpperCase() ?? "?"}
                  </Text>
                </LinearGradient>
              )}
            </View>
          </LinearGradient>

          {/* Dot de status */}
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
        </View>

        {/* Info */}
        <Text style={styles.name} numberOfLines={1}>
          {provider.name}
        </Text>

        <Text style={styles.specialty} numberOfLines={1}>
          {mainService?.tag_name ?? "Prestador de serviços"}
        </Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.rating}>
            {provider.avg_rating > 0 ? provider.avg_rating.toFixed(1) : "Novo"}
          </Text>
          {provider.total_reviews > 0 && (
            <Text style={styles.reviews}>({provider.total_reviews})</Text>
          )}
        </View>

        {/* Distância */}
        <Text style={styles.distance}>📍 {provider.distance_km} km</Text>

        {/* Preço */}
        {mainService?.price_min != null && (
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>
              R$ {Number(mainService.price_min).toLocaleString("pt-BR")}
            </Text>
          </View>
        )}
      </Pressable>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 4,
  },
  card: {
    width: 150,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 12,
    paddingTop: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(108,61,224,0.08)",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 4,
    marginBottom: 8,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#fff",
    opacity: 0.9,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  avatarWrapper: {
    alignSelf: "center",
    position: "relative",
    marginBottom: 10,
  },
  avatarRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.primary,
  },
  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 2,
  },
  specialty: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 8,
    opacity: 0.6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    marginBottom: 4,
  },
  star: {
    fontSize: 13,
    color: "#F59E0B",
  },
  rating: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
  },
  reviews: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  distance: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  priceTag: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "center",
  },
  priceText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: "700",
  },
});
