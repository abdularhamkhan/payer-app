
import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Tx = {
  id: string;
  title: string;
  amount: number;
  date: string;
  category?: string;
};

export default function TransactionsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  // Mock data — replace with Convex queries later
  const data: Tx[] = useMemo(
    () => [
      { id: "1", title: "Grocery - SuperMart", amount: -1250.5, date: "2025-11-01 12:34", category: "Food" },
      { id: "2", title: "Salary - Acme Corp", amount: 450000, date: "2025-10-28 09:01", category: "Income" },
      { id: "3", title: "Coffee - Corner Cafe", amount: -250, date: "2025-10-26 08:20", category: "Food" },
    ],
    []
  );

  const renderItem = ({ item }: { item: Tx }) => (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: colors.surface }]}
      onPress={() => router.push(`/(protected)/transactions/detail?id=${item.id}` as any)}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.avatar, { backgroundColor: colors.gradients.surface[0] }]}>
          <Ionicons name="receipt-outline" size={18} color={colors.text} />
        </View>
        <View>
          <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.itemMeta, { color: colors.textMuted }]}>{item.date} • {item.category}</Text>
        </View>
      </View>
      <Text style={[styles.itemAmount, { color: item.amount < 0 ? colors.danger : colors.success }]}> {item.amount < 0 ? "-" : "+"}Rs. {Math.abs(item.amount).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <Screen safeArea>
      <View style={styles.headerWrap}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Transactions</Text>
        <TouchableOpacity onPress={() => router.push("/(protected)/transactions/new" as any)} style={styles.headerBtn}>
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={() => (
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text style={{ color: colors.textMuted }}>No transactions yet — they will appear here.</Text>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: { padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  headerBtn: { padding: 6 },

  item: { padding: 12, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  itemTitle: { fontSize: 15, fontWeight: "700" },
  itemMeta: { fontSize: 12, marginTop: 2 },
  itemAmount: { fontSize: 14, fontWeight: "700" },
});

