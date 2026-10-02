import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuth } from "../hooks/useAuth";
import { router } from "expo-router";

export default function RootLayout() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.replace("/(auth)/login");
      }
    }
  }, [session, loading]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="provider/[id]"
          options={{
            headerShown: true,
            headerTitle: "Perfil do Prestador",
            headerBackTitle: "Voltar",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="request/[id]"
          options={{
            headerShown: true,
            headerTitle: "Solicitação",
            headerBackTitle: "Voltar",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
