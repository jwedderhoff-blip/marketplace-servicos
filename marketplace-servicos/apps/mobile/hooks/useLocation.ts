import { useState, useEffect } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";

export interface Coords {
  lat: number;
  lng: number;
}

export function useLocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Na web, resolve imediatamente sem bloquear (localização é opcional)
    if (Platform.OS === "web") {
      setLoading(false);
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => setError("Localização não disponível"),
          { timeout: 5000 }
        );
      }
      return;
    }

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permissão de localização negada");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCoords({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      setLoading(false);
    })();
  }, []);

  return { coords, error, loading };
}
