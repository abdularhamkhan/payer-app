// app/(protected)/home/index.tsx
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * Home screen: balance card, quick actions, recent transactions.
 * Visuals inspired by your hand-sketched screens.
 *
 * Wire the placeholders to Convex queries/mutations as needed.
 */

type TX = {
  id: string;
  title: string;
  subtitle?: string;
  amount: number;
  type: "DEBIT" | "CREDIT";
};

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  // TODO: replace this with a Convex query to fetch user wallet & transactions
  const balance = 12500.5;
  const currency = "PKR";

  const sampleTx: TX[] = useMemo(
    () => [
      { id: "1", title: "Food", subtitle: "12:34 Nov 12", amount: -12.5, type: "DEBIT" },
      { id: "2", title: "Salary", subtitle: "22:34 Nov 12", amount: +480, type: "CREDIT" },
    ],
    []
  );

  const QuickAction = ({ label, onPress }: { label: string; onPress?: () => void }) => (
    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.surface }]} onPress={onPress}>
      <View style={styles.actionDot} />
      <Text style={[styles.actionLabel, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Screen gradient>
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.header}>
          <Text style={[styles.hi, { color: colors.text }]}>Hi,</Text>
          {/* Add avatar / profile icon on right later */}
        </View>

        {/* Balance card */}
        <View style={[styles.balanceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.balanceLabel, { color: colors.textMuted }]}>Your Balance</Text>
          <Text style={[styles.balanceAmount, { color: colors.text }]}>
            {currency} {balance.toLocaleString()}
          </Text>
        </View>

        {/* Quick actions row */}
        <View style={styles.quickRow}>
          <QuickAction label="Topup" onPress={() => router.push("/(protected)/wallets")} />
          <QuickAction label="Transfer" onPress={() => router.push("/(protected)/home?flow=transfer")} />
          <QuickAction label="Request" onPress={() => router.push("/(protected)/home?flow=request")} />
          <QuickAction label="More" onPress={() => router.push("/(protected)/profile")} />
        </View>

        {/* Transactions header */}
        <View style={styles.txHeader}>
          <Text style={[styles.txTitle, { color: colors.text }]}>Transaction History</Text>
          <TouchableOpacity onPress={() => router.push("/(protected)/transactions")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction list */}
        <FlatList
          data={sampleTx}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={[styles.txRow, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <View style={styles.txLeft}>
                <View style={[styles.txAvatar, { backgroundColor: colors.gradients.muted[0] }]} />
                <View>
                  <Text style={[styles.txTitleText, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.txSubtitle, { color: colors.textMuted }]}>{item.subtitle}</Text>
                </View>
              </View>
              <Text style={[styles.txAmount, { color: item.amount > 0 ? colors.success : colors.danger }]}>
                {item.amount > 0 ? `+${item.amount}` : `${item.amount}`}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={{ padding: 20 }}>
              <Text style={{ color: colors.textMuted }}>No transactions yet</Text>
            </View>
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  hi: { fontSize: 18, fontWeight: "700" },

  balanceCard: {
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  balanceLabel: { fontSize: 14 },
  balanceAmount: { fontSize: 28, fontWeight: "800", marginTop: 8 },

  quickRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 18 },
  actionBtn: { width: 80, height: 88, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  actionDot: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#eee", marginBottom: 8 },
  actionLabel: { fontSize: 12, fontWeight: "600" },

  txHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20 },
  txTitle: { fontSize: 16, fontWeight: "700" },
  seeAll: { fontSize: 13 },

  txRow: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txLeft: { flexDirection: "row", gap: 12, alignItems: "center" as any },
  txAvatar: { width: 44, height: 44, borderRadius: 22 },
  txTitleText: { fontSize: 15, fontWeight: "700" },
  txSubtitle: { fontSize: 12 },

  txAmount: { fontSize: 14, fontWeight: "700" },
});











// // app/(protected)/home/index.tsx
// import Screen from "@/components/ui/Screen";
// import useTheme from "@/hooks/useTheme";
// import React from "react";
// import { Text, View } from "react-native";

// /**
//  * Minimal Home screen scaffold. Replace UI with your components (BalanceCard, QuickActions, TransactionHistory, etc).
//  * Keep the screen wrapped with the shared Screen component.
//  */
// const HomeScreen = () => {
//   const { colors } = useTheme();

//   return (
//     <Screen gradient scrollable>
//       <View style={{ padding: 8 }}>
//         <Text style={{ color: colors.text, fontSize: 20, fontWeight: "700" }}>Hi,</Text>

//         {/* Placeholder balance card */}
//         <View style={{ marginTop: 12, padding: 16, borderRadius: 12, backgroundColor: colors.surface }}>
//           <Text style={{ color: colors.textMuted }}>Your balance</Text>
//           <Text style={{ color: colors.text, fontSize: 28, fontWeight: "700", marginTop: 8 }}>Rs. 0.00</Text>
//         </View>

//         {/* Quick actions (replace with your component) */}
//         <View style={{ marginTop: 18 }}>
//           <Text style={{ color: colors.textMuted }}>Quick actions (Topup, Transfer, Request, More)</Text>
//         </View>

//         {/* Transaction history placeholder */}
//         <View style={{ marginTop: 30 }}>
//           <Text style={{ color: colors.textMuted }}>Recent transactions</Text>
//           <Text style={{ color: colors.text, marginTop: 12 }}>— No transactions yet —</Text>
//         </View>
//       </View>
//     </Screen>
//   );
// };

// export default HomeScreen;
