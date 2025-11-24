// app/(protected)/home/index.tsx
import { api } from "@/convex/_generated/api";
import InfoCard from "@/components/ui/InfoCard";
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useUser();

  // Convex queries
  const wallet = useQuery(api.wallets.get.get);
  const transactions = useQuery(api.transactions.list.list, { limit: 10, cursor: undefined });
  const createWallet = useMutation(api.wallets.create.create);

  // Create wallet if doesn't exist
  useEffect(() => {
    if (wallet === null) {
      createWallet();
    }
  }, [wallet]);

  const QuickAction = ({ label, icon, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; onPress?: () => void }) => (
    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onPress}>
      <LinearGradient
        colors={colors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.actionIcon}
      >
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </LinearGradient>
      <Text style={[styles.actionLabel, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (wallet === undefined || transactions === undefined) {
    return (
      <Screen>
        <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading your wallet...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen gradient>
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textMuted }]}>Hi,</Text>
            <Text style={[styles.userName, { color: colors.text }]}>{user?.firstName || "Guest"}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(protected)/profile")}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{user?.firstName?.charAt(0) || "G"}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Balance Card with Gradient */}
        <TouchableOpacity activeOpacity={0.9}>
          <LinearGradient
            colors={colors.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <Text style={styles.balanceLabel}>Your Balance</Text>
            <Text style={styles.balanceAmount}>
              Rs. {wallet?.balance?.toLocaleString() || "0"}
            </Text>
            <Text style={styles.balanceIban}>{wallet?.iban || "No IBAN"}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickRow}>
          <QuickAction label="Topup" icon="arrow-down-outline" onPress={() => router.push("/(protected)/wallets")} />
          <QuickAction label="Transfer" icon="swap-horizontal-outline" onPress={() => router.push("/(protected)/transactions/new")} />
          <QuickAction label="Request" icon="arrow-up-outline" onPress={() => router.push("/(protected)/transactions/new")} />
          <QuickAction label="More" icon="ellipsis-horizontal-outline" onPress={() => router.push("/(protected)/profile")} />
        </View>

        {/* Transactions Header */}
        <View style={styles.txHeader}>
          <Text style={[styles.txTitle, { color: colors.text }]}>Transaction History</Text>
          <TouchableOpacity onPress={() => router.push("/(protected)/stats")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction List */}
        <FlatList
          data={transactions?.items || []}
          keyExtractor={(t) => t._id}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <InfoCard
              onPress={() => router.push(`/(protected)/transactions/detail?id=${item._id}`)}
              style={styles.txRow}
            >
              <View style={styles.txContent}>
                <View style={styles.txLeft}>
                  <View style={[
                    styles.txIcon,
                    { backgroundColor: item.type === "CREDIT" ? colors.success + "20" : colors.danger + "20" }
                  ]}>
                    <Ionicons
                      name={item.type === "CREDIT" ? "arrow-down" : "arrow-up"}
                      size={20}
                      color={item.type === "CREDIT" ? colors.success : colors.danger}
                    />
                  </View>
                  <View>
                    <Text style={[styles.txTitleText, { color: colors.text }]}>
                      {item.description || (item.type === "CREDIT" ? "Received" : "Sent")}
                    </Text>
                    <Text style={[styles.txSubtitle, { color: colors.textMuted }]}>
                      {formatDate(item.createdAt)}
                    </Text>
                  </View>
                </View>
                <Text style={[
                  styles.txAmount,
                  { color: item.type === "CREDIT" ? colors.success : colors.danger }
                ]}>
                  {item.type === "CREDIT" ? "+" : "-"}Rs. {Math.abs(item.amount).toLocaleString()}
                </Text>
              </View>
            </InfoCard>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={64} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No transactions yet</Text>
              <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
                Start by topping up your wallet
              </Text>
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
