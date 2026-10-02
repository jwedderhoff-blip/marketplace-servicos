import { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from "react-native";
import { Colors } from "../constants/colors";
import type { ProviderNearby } from "../lib/database.types";
import { AvailabilityDot } from "./AvailabilityDot";

interface ProviderCardProps {
  provider: ProviderNearby;
  onPress: () => void;
}

export function ProviderCard({ provider, onPress }: ProviderCardProps) {
  const mainService = provider.services?.[0];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Foto de perfil */}
      <View style={styles.avatarContainer}>
        {provider.avatar_url ? (
          <Image source={{ uri: provider.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitial}>
              {provider.name?.charAt(0).toUpperCase() ?? "?"}
            </Text>
          </View>
        )}
        <AvailabilityDot status={provider.availability_status} />
      </View>

      {/* Info */}
      <Text style={styles.name} numberOfLines={1}>
        {provider.name}
      </Text>

      <Text style={styles.specialty} numberOfLines={1}>
        {mainService?.tag_name ?? "Prestador de serviços"}
      </Text>

      {/* Rating */}
      <View style={styles.ratingRow}>
        <Text style={styles.star}>⭐</Text>
        <Text style={styles.rating}>
          {provider.avg_rating > 0
            ? provider.avg_rating.toFixed(1)
            : "Novo"}
        </Text>
        {provider.total_reviews > 0 && (
          <Text style={styles.reviews}>({provider.total_reviews})</Text>
        )}
      </View>

      {/* Distância */}
      <Text style={styles.distance}>📍 {provider.distance_km} km</Text>

      {/* Preço (se disponível) */}
      {mainService?.price_min && (
        <Text style={styles.price}>
          A partir de R$ {mainService.price_min.toLocaleString("pt-BR")}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
  },
  avatarFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.primary,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 2,
  },
  specialty: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    marginBottom: 4,
  },
  star: {
    fontSize: 11,
  },
  rating: {
    fontSize: 13,
    fontWeight: "600",
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
    marginBottom: 4,
  },
  price: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: "500",
    textAlign: "center",
  },
});
