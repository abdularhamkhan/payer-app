// app/(protected)/stats/index.tsx
import { api } from "@/convex/_generated/api";
import InfoCard from "@/components/ui/InfoCard";
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState, useMemo } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type FilterType = "all" | "credit" | "debit";

export default function StatsScreen() {
	const { colors } = useTheme();
	const router = useRouter();
	const [filter, setFilter] = useState<FilterType>("all");

	// Fetch transactions
	const transactions = useQuery(api.transactions.list.list, { limit: 100, cursor: undefined });

	// Calculate stats
	const stats = useMemo(() => {
		if (!transactions?.items) return { totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: 0 };

		const income = transactions.items.filter((t) => t.type === "CREDIT").reduce((sum, t) => sum + t.amount, 0);
		const expense = transactions.items.filter((t) => t.type === "DEBIT").reduce((sum, t) => sum + Math.abs(t.amount), 0);

		return {
			totalIncome: income,
			totalExpense: expense,
			balance: income - expense,
			transactionCount: transactions.items.length,
		};
	}, [transactions]);

	// Filter transactions
	const filteredTransactions = useMemo(() => {
		if (!transactions?.items) return [];
		if (filter === "all") return transactions.items;
		return transactions.items.filter((t) => (filter === "credit" ? t.type === "CREDIT" : t.type === "DEBIT"));
	}, [transactions, filter]);

	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp);
		const now = new Date();
		const isToday = date.toDateString() === now.toDateString();

		if (isToday) {
			return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
		}
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	};

	const FilterButton = ({ type, label }: { type: FilterType; label: string }) => (
		<TouchableOpacity
			style={[
				styles.filterButton,
				{
					backgroundColor: filter === type ? colors.primary : colors.surface,
					borderColor: colors.border,
				},
			]}
			onPress={() => setFilter(type)}
		>
			<Text style={[styles.filterLabel, { color: filter === type ? "#FFFFFF" : colors.text }]}>{label}</Text>
		</TouchableOpacity>
	);

	if (!transactions) {
		return (
			<Screen>
				<View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			</Screen>
		);
	}

	return (
		<Screen gradient>
			<View style={[styles.container, { backgroundColor: colors.bg }]}>
				<Text style={[styles.title, { color: colors.text }]}>Transaction History</Text>

				{/* Stats Cards */}
				<View style={styles.statsGrid}>
					<InfoCard style={styles.statCard}>
						<View style={[styles.statIcon, { backgroundColor: colors.success + "20" }]}>
							<Ionicons name="arrow-down" size={24} color={colors.success} />
						</View>
						<Text style={[styles.statLabel, { color: colors.textMuted }]}>Income</Text>
						<Text style={[styles.statValue, { color: colors.success }]}>Rs. {stats.totalIncome.toLocaleString()}</Text>
					</InfoCard>

					<InfoCard style={styles.statCard}>
						<View style={[styles.statIcon, { backgroundColor: colors.danger + "20" }]}>
							<Ionicons name="arrow-up" size={24} color={colors.danger} />
						</View>
						<Text style={[styles.statLabel, { color: colors.textMuted }]}>Expense</Text>
						<Text style={[styles.statValue, { color: colors.danger }]}>Rs. {stats.totalExpense.toLocaleString()}</Text>
					</InfoCard>
				</View>

				{/* Total Transactions */}
				<InfoCard style={styles.totalCard}>
					<View style={styles.totalRow}>
						<View>
							<Text style={[styles.totalLabel, { color: colors.textMuted }]}>Total Transactions</Text>
							<Text style={[styles.totalValue, { color: colors.text }]}>{stats.transactionCount}</Text>
						</View>
						<View style={styles.totalRight}>
							<Text style={[styles.totalLabel, { color: colors.textMuted }]}>Net Balance</Text>
							<Text style={[styles.totalValue, { color: stats.balance >= 0 ? colors.success : colors.danger }]}>
								{stats.balance >= 0 ? "+" : "-"}Rs. {Math.abs(stats.balance).toLocaleString()}
							</Text>
						</View>
					</View>
				</InfoCard>

				{/* Filter Buttons */}
				<View style={styles.filterContainer}>
					<FilterButton type="all" label="All" />
					<FilterButton type="credit" label="Income" />
					<FilterButton type="debit" label="Expense" />
				</View>

				{/* Transactions List */}
				<FlatList
					data={filteredTransactions}
					keyExtractor={(t) => t._id}
					contentContainerStyle={{ paddingBottom: 100 }}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => (
						<InfoCard onPress={() => router.push(`/(protected)/transactions/detail?id=${item._id}`)} style={styles.txRow}>
							<View style={styles.txContent}>
								<View style={styles.txLeft}>
									<View
										style={[
											styles.txIcon,
											{ backgroundColor: item.type === "CREDIT" ? colors.success + "20" : colors.danger + "20" },
										]}
									>
										<Ionicons name={item.type === "CREDIT" ? "arrow-down" : "arrow-up"} size={20} color={item.type === "CREDIT" ? colors.success : colors.danger} />
									</View>
									<View>
										<Text style={[styles.txTitleText, { color: colors.text }]}>{item.description || (item.type === "CREDIT" ? "Received" : "Sent")}</Text>
										<Text style={[styles.txSubtitle, { color: colors.textMuted }]}>{formatDate(item.createdAt)}</Text>
									</View>
								</View>
								<Text style={[styles.txAmount, { color: item.type === "CREDIT" ? colors.success : colors.danger }]}>
									{item.type === "CREDIT" ? "+" : "-"}Rs. {Math.abs(item.amount).toLocaleString()}
								</Text>
							</View>
						</InfoCard>
					)}
					ListEmptyComponent={
						<View style={styles.emptyState}>
							<Ionicons name="receipt-outline" size={64} color={colors.textMuted} />
							<Text style={[styles.emptyText, { color: colors.textMuted }]}>No transactions yet</Text>
						</View>
					}
				/>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
		marginBottom: 20,
	},
	statsGrid: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 12,
	},
	statCard: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 20,
	},
	statIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 12,
	},
	statLabel: {
		fontSize: 13,
		marginBottom: 6,
	},
	statValue: {
		fontSize: 18,
		fontWeight: "700",
	},
	totalCard: {
		marginBottom: 20,
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	totalLabel: {
		fontSize: 13,
		marginBottom: 6,
	},
	totalValue: {
		fontSize: 20,
		fontWeight: "700",
	},
	totalRight: {
		alignItems: "flex-end",
	},
	filterContainer: {
		flexDirection: "row",
		gap: 8,
		marginBottom: 16,
	},
	filterButton: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 12,
		alignItems: "center",
		borderWidth: 1,
	},
	filterLabel: {
		fontSize: 14,
		fontWeight: "600",
	},
	txRow: {
		marginBottom: 12,
	},
	txContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	txLeft: {
		flexDirection: "row",
		gap: 12,
		alignItems: "center",
		flex: 1,
	},
	txIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	txTitleText: {
		fontSize: 15,
		fontWeight: "700",
	},
	txSubtitle: {
		fontSize: 12,
		marginTop: 4,
	},
	txAmount: {
		fontSize: 15,
		fontWeight: "700",
	},
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
	},
	emptyText: {
		fontSize: 16,
		marginTop: 16,
	},
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
