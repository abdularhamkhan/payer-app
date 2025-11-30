// app/(protected)/home/index.tsx
import InfoCard from "@/components/ui/InfoCard";
import Screen from "@/components/ui/Screen";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  // Convex queries
  const convexUser = useQuery(api.users.me.me);
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

  if (wallet === undefined || transactions === undefined || !convexUser) {
    return (
      <Screen>
        <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading your wallet...</Text>
        </View>
      </Screen>
    );
  }

  const firstName = convexUser.fullName?.split(' ')[0] || 'User';

  return (
    <Screen gradient scrollable>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/profile")} style={styles.headerLeft}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              {convexUser.avatar ? (
                <Image source={{ uri: convexUser.avatar }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.greeting, { color: colors.textMuted }]}>Hi,</Text>
            <Text style={[styles.userName, { color: colors.text }]}>{firstName}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/notifications")} style={styles.bellButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
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
          <QuickAction label="Topup" icon="arrow-down-outline" onPress={() => router.push("/transactions/new")} />
          <QuickAction label="Transfer" icon="swap-horizontal-outline" onPress={() => router.push("/transactions/new")} />
          <QuickAction label="Request" icon="arrow-up-outline" onPress={() => router.push("/transactions/new")} />
          <QuickAction label="More" icon="ellipsis-horizontal-outline" onPress={() => router.push("/profile")} />
        </View>

        {/* Transactions Header */}
        <View style={styles.txHeader}>
          <Text style={[styles.txTitle, { color: colors.text }]}>Transaction History</Text>
          <TouchableOpacity onPress={() => router.push("/(protected)/stats")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction List */}
        {transactions?.items && transactions.items.length > 0 ? (
          transactions.items.map((item) => (
            <InfoCard
              key={item._id}
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
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No transactions yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
              Start by topping up your wallet
            </Text>
          </View>
        )}
        <View style={{ height: 40 }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 14 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  greeting: { fontSize: 12, textAlign: "center" },
  userName: { fontSize: 20, fontWeight: "700", marginTop: 2, textAlign: "center" },
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", overflow: "hidden" },
  avatarImage: { width: 48, height: 48, borderRadius: 24 },
  avatarText: { fontSize: 20, fontWeight: "700", color: "#FFFFFF" },
  bellButton: { width: 48, height: 48, justifyContent: "center", alignItems: "center" },

  balanceCard: {
    marginTop: 12,
    borderRadius: 16,
    padding: 20,
  },
  balanceLabel: { fontSize: 14, color: "#FFFFFF", opacity: 0.9 },
  balanceAmount: { fontSize: 32, fontWeight: "800", marginTop: 8, color: "#FFFFFF" },
  balanceIban: { fontSize: 12, color: "#FFFFFF", opacity: 0.8, marginTop: 8 },

  quickRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 24 },
  actionBtn: { width: 80, height: 88, borderRadius: 16, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  actionIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  actionLabel: { fontSize: 12, fontWeight: "600" },

  txHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 24, marginBottom: 12 },
  txTitle: { fontSize: 18, fontWeight: "700" },
  seeAll: { fontSize: 14, fontWeight: "600" },

  txRow: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
  },
  txContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  txLeft: { flexDirection: "row", gap: 12, alignItems: "center" },
  txIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center" },
  txTitleText: { fontSize: 15, fontWeight: "600" },
  txSubtitle: { fontSize: 12, marginTop: 4 },
  txAmount: { fontSize: 16, fontWeight: "700" },

  emptyState: { alignItems: "center", marginTop: 60, paddingHorizontal: 32 },
  emptyText: { fontSize: 18, fontWeight: "600", marginTop: 16 },
  emptySubtext: { fontSize: 14, marginTop: 8, textAlign: "center" },
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
