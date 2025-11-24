// app/(protected)/wallets/index.tsx
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * Wallets screen: card list and "Apply for card" screen.
 * Replace placeholder cards with Convex-driven data.
 */

type CardItem = {
  id: string;
  provider: string;
  last4: string;
  type: "debit" | "credit";
  frozen?: boolean;
};

const sampleCards: CardItem[] = [
  { id: "c1", provider: "Mastercard", last4: "4242", type: "debit" },
  { id: "c2", provider: "Visa", last4: "1111", type: "credit" },
];

export default function WalletsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Screen>
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={[styles.title, { color: colors.text }]}>Cards</Text>

        <FlatList
          data={sampleCards}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/(protected)/wallets/cardDetail?id=${item.id}`)}
              style={[styles.cardItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View>
                <Text style={[styles.cardProvider, { color: colors.text }]}>{item.provider}</Text>
                <Text style={[styles.cardNumber, { color: colors.textMuted }]}>**** **** **** {item.last4}</Text>
              </View>
              <Text style={[styles.cardType, { color: colors.primary }]}>{item.type.toUpperCase()}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={{ padding: 24 }}>
              <Text style={{ color: colors.textMuted }}>No cards yet. Apply for a card to get started.</Text>
            </View>
          }
        />

        <TouchableOpacity
          style={[styles.applyBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(protected)/wallets/applyCard")}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>Apply for Card</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 16 },

  cardItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardProvider: { fontSize: 16, fontWeight: "800" },
  cardNumber: { fontSize: 14, marginTop: 6 },
  cardType: { fontSize: 12, fontWeight: "700" },

  applyBtn: {
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});


// // app/(protected)/wallets/index.tsx
// import Screen from "@/components/ui/Screen";
// import React from "react";
// import { Text, View } from "react-native";

// export default function WalletsScreen() {
//   return (
//     <Screen>
//       <View style={{ padding: 16 }}>
//         <Text style={{ fontSize: 18, fontWeight: "700" }}>Wallets</Text>
//         <Text style={{ marginTop: 12 }}>This is the wallets screen (list / create / topup / withdraw).</Text>
//       </View>
//     </Screen>
//   );
// }
