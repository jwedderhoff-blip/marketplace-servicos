import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import { Colors } from "../../constants/colors";

export default function LoginScreen() {
  const { signInWithGoogle, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      Alert.alert("Erro ao entrar", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>🏪</Text>
        </View>
        <Text style={styles.appName}>Praça de Serviços</Text>
        <Text style={styles.tagline}>
          Encontre prestadores locais confiáveis{"\n"}perto de você, quando precisar.
        </Text>
      </View>

      <View style={styles.features}>
        {[
          { icon: "🏠", text: "Serviços para sua casa" },
          { icon: "📍", text: "Prestadores na sua região" },
          { icon: "⭐", text: "Avaliações reais de clientes" },
        ].map(({ icon, text }) => (
          <View key={text} style={styles.featureRow}>
            <Text style={styles.featureIcon}>{icon}</Text>
            <Text style={styles.featureText}>{text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>Entrar com Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.terms}>
          Ao entrar, você aceita os{" "}
          <Text style={styles.link}>Termos de Uso</Text> e a{" "}
          <Text style={styles.link}>Política de Privacidade</Text> (LGPD)
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 32,
  },
  hero: {
    alignItems: "center",
    paddingTop: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  features: {
    gap: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: "500",
  },
  footer: {
    gap: 16,
  },
  googleButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  terms: {
    fontSize: 12,
    color: Colors.textDisabled,
    textAlign: "center",
    lineHeight: 18,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: "underline",
  },
});
