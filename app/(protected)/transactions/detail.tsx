// app/(protected)/transactions/detail.tsx
import { api } from "@/convex/_generated/api";
import InfoCard from "@/components/ui/InfoCard";
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Id } from "@/convex/_generated/dataModel";

export default function TransactionDetailScreen() {
	const { colors } = useTheme();
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();

	// Fetch all transactions and find the specific one
	const transactions = useQuery(api.transactions.list.list, { limit: 100, cursor: undefined });
	const transaction = transactions?.items.find((t) => t._id === id);

	if (transactions === undefined || !transaction) {
		return (
			<Screen>
				<View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			</Screen>
		);
	}

	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp);
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const isCredit = transaction.type === "CREDIT";
	const statusColor = transaction.status === "SUCCESS" ? colors.success : transaction.status === "FAILED" ? colors.danger : colors.warning;

	return (
		<Screen gradient>
			<View style={[styles.container, { backgroundColor: colors.bg }]}>
				<Text style={[styles.title, { color: colors.text }]}>Transaction Details</Text>

				{/* Amount Section */}
				<View style={styles.amountSection}>
					<View style={[styles.iconContainer, { backgroundColor: isCredit ? colors.success + "20" : colors.danger + "20" }]}>
						<Ionicons name={isCredit ? "arrow-down" : "arrow-up"} size={40} color={isCredit ? colors.success : colors.danger} />
					</View>
					<Text style={[styles.amount, { color: isCredit ? colors.success : colors.danger }]}>
						{isCredit ? "+" : "-"}Rs. {Math.abs(transaction.amount).toLocaleString()}
					</Text>
					<Text style={[styles.transactionType, { color: colors.textMuted }]}>{isCredit ? "Received" : "Sent"}</Text>
				</View>

				{/* Transaction Info */}
				<InfoCard style={styles.infoCard}>
					<Text style={[styles.sectionTitle, { color: colors.text }]}>Transaction Information</Text>

					<View style={styles.infoRow}>
						<Text style={[styles.infoLabel, { color: colors.textMuted }]}>Status</Text>
						<View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
							<Text style={[styles.statusText, { color: statusColor }]}>{transaction.status}</Text>
						</View>
					</View>

					<View style={[styles.divider, { backgroundColor: colors.border }]} />

					<View style={styles.infoRow}>
						<Text style={[styles.infoLabel, { color: colors.textMuted }]}>Type</Text>
						<Text style={[styles.infoValue, { color: colors.text }]}>{transaction.type}</Text>
					</View>

					<View style={[styles.divider, { backgroundColor: colors.border }]} />

					<View style={styles.infoRow}>
						<Text style={[styles.infoLabel, { color: colors.textMuted }]}>Method</Text>
						<Text style={[styles.infoValue, { color: colors.text }]}>{transaction.method}</Text>
					</View>

					<View style={[styles.divider, { backgroundColor: colors.border }]} />

					<View style={styles.infoRow}>
						<Text style={[styles.infoLabel, { color: colors.textMuted }]}>Date & Time</Text>
						<Text style={[styles.infoValue, { color: colors.text }]}>{formatDate(transaction.createdAt)}</Text>
					</View>

					{transaction.description && (
						<>
							<View style={[styles.divider, { backgroundColor: colors.border }]} />
							<View style={styles.infoRow}>
								<Text style={[styles.infoLabel, { color: colors.textMuted }]}>Description</Text>
								<Text style={[styles.infoValue, { color: colors.text }]}>{transaction.description}</Text>
							</View>
						</>
					)}

					<View style={[styles.divider, { backgroundColor: colors.border }]} />

					<View style={styles.infoRow}>
						<Text style={[styles.infoLabel, { color: colors.textMuted }]}>Transaction ID</Text>
						<Text style={[styles.infoValue, { color: colors.text, fontSize: 11 }]} numberOfLines={1}>
							{transaction._id}
						</Text>
					</View>
				</InfoCard>

				{/* Receipt Actions */}
				<InfoCard style={styles.actionsCard}>
					<TouchableOpacity style={styles.actionRow}>
						<Ionicons name="download-outline" size={24} color={colors.primary} />
						<Text style={[styles.actionText, { color: colors.text }]}>Download Receipt</Text>
					</TouchableOpacity>

					<View style={[styles.divider, { backgroundColor: colors.border }]} />

					<TouchableOpacity style={styles.actionRow}>
						<Ionicons name="share-outline" size={24} color={colors.primary} />
						<Text style={[styles.actionText, { color: colors.text }]}>Share Transaction</Text>
					</TouchableOpacity>
				</InfoCard>

				<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
					<Text style={[styles.backText, { color: colors.textMuted }]}>← Back to Transactions</Text>
				</TouchableOpacity>
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
		marginBottom: 24,
	},
	amountSection: {
		alignItems: "center",
		marginBottom: 24,
	},
	iconContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
	},
	amount: {
		fontSize: 36,
		fontWeight: "800",
		marginBottom: 8,
	},
	transactionType: {
		fontSize: 16,
	},
	infoCard: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 16,
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 12,
	},
	infoLabel: {
		fontSize: 14,
		flex: 1,
	},
	infoValue: {
		fontSize: 14,
		fontWeight: "600",
		flex: 1,
		textAlign: "right",
	},
	statusBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 12,
	},
	statusText: {
		fontSize: 12,
		fontWeight: "700",
		textTransform: "uppercase",
	},
	divider: {
		height: 1,
	},
	actionsCard: {
		marginBottom: 16,
	},
	actionRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingVertical: 12,
	},
	actionText: {
		fontSize: 16,
		fontWeight: "600",
	},
	backButton: {
		alignItems: "center",
		paddingVertical: 12,
	},
	backText: {
		fontSize: 15,
	},
});