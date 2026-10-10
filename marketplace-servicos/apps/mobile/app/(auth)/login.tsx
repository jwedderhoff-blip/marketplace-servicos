import { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { useAuth } from "../../hooks/useAuth";
import { Colors } from "../../constants/colors";

const { width } = Dimensions.get("window");

const FEATURES = [
  { icon: "🏠", text: "Serviços para sua casa" },
  { icon: "📍", text: "Prestadores na sua região" },
  { icon: "⭐", text: "Avaliações reais de clientes" },
];

function FeatureRow({
  icon,
  text,
  delay,
}: {
  icon: string;
  text: string;
  delay: number;
}) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-24);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateX.value = withDelay(
      delay,
      withSpring(0, { damping: 18, stiffness: 120 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.featureRow, style]}>
      <View style={styles.featureIconBg}>
        <Text style={styles.featureIcon}>{icon}</Text>
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </Animated.View>
  );
}

export default function LoginScreen() {
  const { signInWithGoogle, loading } = useAuth();

  const heroOpacity = useSharedValue(0);
  const heroTranslateY = useSharedValue(32);
  const buttonScale = useSharedValue(0.88);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    heroOpacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.exp) });
    heroTranslateY.value = withSpring(0, { damping: 18, stiffness: 90 });
    buttonScale.value = withDelay(700, withSpring(1, { damping: 14, stiffness: 100 }));
    buttonOpacity.value = withDelay(700, withTiming(1, { duration: 400 }));
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  const pressedScale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressedScale.value }],
  }));

  const handlePressIn = () => {
    pressedScale.value = withSpring(0.96, { damping: 12, stiffness: 200 });
  };
  const handlePressOut = () => {
    pressedScale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      Alert.alert("Erro ao entrar", error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#3A0CA3", "#6C3DE0", "#8B5CF6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {/* Decorative circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <SafeAreaView style={styles.safeArea}>
        {/* Hero */}
        <Animated.View style={[styles.hero, heroStyle]}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={["#ffffff30", "#ffffff15"]}
              style={styles.logoBg}
            >
              <Text style={styles.logoEmoji}>🏪</Text>
            </LinearGradient>
          </View>
          <Text style={styles.appName}>Platz</Text>
          <Text style={styles.tagline}>
            Encontre prestadores locais confiáveis{"\n"}perto de você, quando precisar.
          </Text>
        </Animated.View>

        {/* Feature rows */}
        <View style={styles.features}>
          {FEATURES.map(({ icon, text }, i) => (
            <FeatureRow key={text} icon={icon} text={text} delay={300 + i * 120} />
          ))}
        </View>

        {/* Footer */}
        <Animated.View style={[styles.footer, buttonStyle]}>
          <Animated.View style={pressStyle}>
            <TouchableOpacity
              style={styles.googleButtonOuter}
              onPress={handleGoogleSignIn}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={loading}
              activeOpacity={1}
            >
              {/* 3D button effect: highlight top + shadow bottom */}
              <View style={styles.googleButtonHighlight} />
              <LinearGradient
                colors={["#FFFFFF", "#F0ECFF"]}
                style={styles.googleButton}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.primary} />
                ) : (
                  <>
                    <View style={styles.gIconWrapper}>
                      <Text style={styles.gIcon}>G</Text>
                    </View>
                    <Text style={styles.googleButtonText}>Entrar com Google</Text>
                  </>
                )}
              </LinearGradient>
              <View style={styles.googleButtonShadow} />
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.terms}>
            Ao entrar, você aceita os{" "}
            <Text style={styles.link}>Termos de Uso</Text> e a{" "}
            <Text style={styles.link}>Política de Privacidade</Text> (LGPD)
          </Text>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  circle1: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: -80,
    right: -60,
  },
  circle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.04)",
    bottom: 120,
    left: -60,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: 24,
    paddingBottom: 32,
  },
  hero: {
    alignItems: "center",
    paddingTop: 24,
  },
  logoContainer: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoBg: {
    width: 90,
    height: 90,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  logoEmoji: {
    fontSize: 46,
  },
  appName: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    lineHeight: 22,
  },
  features: {
    gap: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  featureIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
    flex: 1,
  },
  footer: {
    gap: 14,
  },
  googleButtonOuter: {
    position: "relative",
  },
  googleButtonHighlight: {
    position: "absolute",
    top: 0,
    left: 2,
    right: 2,
    height: 2,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.7)",
    zIndex: 2,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 17,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  googleButtonShadow: {
    position: "absolute",
    bottom: -4,
    left: 8,
    right: 8,
    height: 12,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: -1,
  },
  gIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4285F4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gIcon: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4285F4",
  },
  googleButtonText: {
    color: Colors.primary,
    fontSize: 17,
    fontWeight: "700",
  },
  terms: {
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    lineHeight: 18,
  },
  link: {
    color: "rgba(255,255,255,0.85)",
    textDecorationLine: "underline",
  },
});
