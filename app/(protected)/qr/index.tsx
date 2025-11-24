// app/(protected)/qr/index.tsx
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * QR screen: big scanner area and quick actions for generating QR codes.
 * Hook expo-barcode-scanner scanning logic where indicated.
 */

export default function QRScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Screen>
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]}>Scan QR</Text>
          {/* avatar / settings can go here */}
        </View>

        {/* Large scanner placeholder */}
        <View style={[styles.scannerWrap, { borderColor: colors.border }]}>
          <View style={[styles.scannerInner, { backgroundColor: colors.surface }]}>
            <Text style={{ color: colors.textMuted }}>Camera preview will show here</Text>
            <Text style={{ color: colors.textMuted, marginTop: 6 }}>Place QR inside the frame</Text>
            {/* TODO: integrate expo-barcode-scanner and show live camera feed instead of this placeholder */}
          </View>
        </View>

        <View style={styles.ctaRow}>
          <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: colors.primary }]} onPress={() => router.push("/(protected)/qr/generate")}>
            <Text style={{ color: "white", fontWeight: "700" }}>Generate QR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.ctaBtnOutline, { borderColor: colors.border }]} onPress={() => router.push("/(protected)/qr/history")}>
            <Text style={{ color: colors.text }}>My QR Codes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 18, fontWeight: "700" },

  scannerWrap: {
    marginTop: 20,
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  scannerInner: {
    width: "100%",
    height: 320,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  ctaRow: { marginTop: 18, flexDirection: "row", justifyContent: "space-between", gap: 12 },
  ctaBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center", marginRight: 8 },
  ctaBtnOutline: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center", borderWidth: 1, marginLeft: 8 },
});


// // app/(protected)/qr/index.tsx
// import Screen from "@/components/ui/Screen";
// import React from "react";
// import { Text, View } from "react-native";

// export default function QRScreen() {
//   return (
//     <Screen>
//       <View style={{ padding: 16 }}>
//         <Text style={{ fontSize: 18, fontWeight: "700" }}>QR Scanner & Generator</Text>
//         <Text style={{ marginTop: 12 }}>Placeholder: we'll integrate expo-barcode-scanner for scanning and your QR generation APIs.</Text>
//       </View>
//     </Screen>
//   );
// }
