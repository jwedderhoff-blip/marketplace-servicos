import { useEffect } from "react";
import { Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuth } from "../hooks/useAuth";
import { router } from "expo-router";

export default function RootLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "(auth)";
    const currentRoute = segments[1] ?? "";
    // register-provider is accessible to logged-in users
    const isOpenAuthRoute = currentRoute === "register-provider";
    if (session && inAuthGroup && !isOpenAuthRoute) {
      router.replace("/(tabs)");
    } else if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
  }, [session, loading, segments]);

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
        <Stack.Screen
          name="admin/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(auth)/register-provider"
          options={{
            headerShown: true,
            headerTitle: "Seja um Prestador",
            headerBackTitle: "Voltar",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
