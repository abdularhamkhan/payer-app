// app/(protected)/stats/index.tsx
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * Stats screen placeholder. Replace these widgets with charts / queries to your transactions.
 */

export default function StatsScreen() {
  const { colors } = useTheme();

  return (
    <Screen>
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={[styles.title, { color: colors.text }]}>Statistics</Text>

        <View style={[styles.widget, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={{ color: colors.textMuted }}>Spending this month</Text>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: "700", marginTop: 8 }}>PKR 12,345</Text>
        </View>

        <View style={[styles.widget, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={{ color: colors.textMuted }}>Top categories</Text>
          <Text style={{ color: colors.text, marginTop: 8 }}>— Food: PKR 2,300</Text>
          <Text style={{ color: colors.text, marginTop: 4 }}>— Transport: PKR 1,100</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  widget: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
});


// // app/(protected)/stats/index.tsx
// import Screen from "@/components/ui/Screen";
// import React from "react";
// import { Text, View } from "react-native";

// export default function StatsScreen() {
//   return (
//     <Screen>
//       <View style={{ padding: 16 }}>
//         <Text style={{ fontSize: 18, fontWeight: "700" }}>Statistics</Text>
//         <Text style={{ marginTop: 12 }}>Top spending / income widgets will go here (computed by queries over transactions).</Text>
//       </View>
//     </Screen>
//   );
// }
