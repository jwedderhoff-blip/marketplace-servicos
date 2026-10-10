import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Colors } from "../../constants/colors";

/**
 * Tela intermediária que recebe o deep link após o Google OAuth.
 * URL esperada: marketplace://auth/callback?code=<PKCE_code>
 * Troca o code por uma sessão Supabase e redireciona para o app.
 */
export default function AuthCallbackScreen() {
  const params = useLocalSearchParams<{ code?: string; error?: string; error_description?: string }>();

  useEffect(() => {
    async function exchange() {
      if (params.error) {
        router.replace("/(auth)/login");
        return;
      }

      if (!params.code) {
        router.replace("/(auth)/login");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(params.code);
      if (error) {
        router.replace("/(auth)/login");
        return;
      }
      // onAuthStateChange em useAuth.ts detecta a sessão → _layout.tsx redireciona
    }

    exchange();
  }, [params.code, params.error]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
