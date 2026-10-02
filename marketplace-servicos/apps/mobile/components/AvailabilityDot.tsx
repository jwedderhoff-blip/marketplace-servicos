import { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import type { AvailabilityStatus } from "../lib/database.types";

const STATUS_COLOR: Record<AvailabilityStatus, string> = {
  available_now: Colors.availableNow,
  available_today: Colors.availableToday,
  unavailable: Colors.unavailable,
};

interface AvailabilityDotProps {
  status: AvailabilityStatus;
  size?: number;
}

export function AvailabilityDot({ status, size = 14 }: AvailabilityDotProps) {
  const pulse = useRef(new Animated.Value(1)).current;
  const color = STATUS_COLOR[status];

  useEffect(() => {
    if (status !== "available_now") return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [status]);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          position: "absolute",
          bottom: 0,
          right: 0,
        },
      ]}
    >
      {status === "available_now" && (
        <Animated.View
          style={[
            styles.pulse,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
              transform: [{ scale: pulse }],
              opacity: 0.4,
            },
          ]}
        />
      )}
      <View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  pulse: {
    position: "absolute",
  },
  dot: {
    borderWidth: 2,
    borderColor: Colors.surface,
  },
});
