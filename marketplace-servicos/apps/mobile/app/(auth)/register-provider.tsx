import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Colors } from "../../constants/colors";

export default function RegisterProviderScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.icon}>🔧</Text>
      <Text style={styles.title}>Seja um Prestador</Text>
      <Text style={styles.sub}>
        Cadastre seus serviços e comece a receber chamados de clientes próximos a você.
      </Text>
      <View style={styles.perks}>
        {[
          { icon: "📱", text: "Receba chamados em tempo real" },
          { icon: "⭐", text: "Construa sua reputação com avaliações" },
          { icon: "💰", text: "Você define seus próprios preços" },
          { icon: "🔒", text: "Plataforma gratuita, sem mensalidade" },
        ].map((perk) => (
          <View key={perk.icon} style={styles.perk}>
            <Text style={styles.perkIcon}>{perk.icon}</Text>
            <Text style={styles.perkText}>{perk.text}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.hint}>
        O cadastro completo está disponível na versão web da plataforma.
      </Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
        <Text style={styles.btnText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { alignItems: "center", padding: 32, paddingTop: 48 },
  icon: { fontSize: 56, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "800", color: Colors.text, marginBottom: 12, textAlign: "center" },
  sub: { fontSize: 15, color: Colors.textSecondary, textAlign: "center", lineHeight: 22, marginBottom: 32 },
  perks: { width: "100%", gap: 14, marginBottom: 32 },
  perk: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: Colors.surface, borderRadius: 14, padding: 14 },
  perkIcon: { fontSize: 22 },
  perkText: { fontSize: 14, fontWeight: "600", color: Colors.text, flex: 1 },
  hint: { fontSize: 13, color: Colors.textSecondary, textAlign: "center", marginBottom: 24, lineHeight: 20 },
  btn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 40 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
