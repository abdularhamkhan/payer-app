// app/(protected)/wallets/index.tsx
import { api } from "@/convex/_generated/api";
import Button from "@/components/ui/Button";
import InfoCard from "@/components/ui/InfoCard";
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WalletsScreen() {
	const { colors } = useTheme();
	const router = useRouter();
	const card = useQuery(api.cards.get.get);

	if (card === undefined) {
		return (
			<Screen>
				<View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			</Screen>
		);
	}

	return (
		<Screen gradient scrollable>
			<View style={styles.container}>
				<Text style={[styles.title, { color: colors.text }]}>My Cards</Text>

				{card ? (
					<>
						{/* Card Display */}
						<TouchableOpacity activeOpacity={0.9} onPress={() => router.push("/(protected)/wallets/cardDetail")}>
							<LinearGradient colors={colors.gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardContainer}>
								<View style={styles.cardHeader}>
									<Text style={styles.cardProvider}>{card.provider}</Text>
									{card.frozen && (
										<View style={styles.frozenBadge}>
											<Ionicons name="snow" size={16} color="#FFFFFF" />
											<Text style={styles.frozenText}>Frozen</Text>
										</View>
									)}
								</View>

								<Text style={styles.cardNumber}>**** **** **** {card.cardLast4}</Text>

								<View style={styles.cardFooter}>
									<View>
										<Text style={styles.cardLabel}>EXPIRY</Text>
										<Text style={styles.cardExpiry}>{card.expiry}</Text>
									</View>
									<Ionicons name="card" size={40} color="#FFFFFF" style={{ opacity: 0.8 }} />
								</View>
							</LinearGradient>
						</TouchableOpacity>

						{/* Card Actions */}
						<View style={styles.actionsGrid}>
							<TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push("/(protected)/wallets/cardDetail")}>
								<Ionicons name="eye-outline" size={28} color={colors.primary} />
								<Text style={[styles.actionLabel, { color: colors.text }]}>View Details</Text>
							</TouchableOpacity>

							<TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push("/(protected)/wallets/cardDetail")}>
								<Ionicons name={card.frozen ? "unlock-outline" : "lock-closed-outline"} size={28} color={colors.primary} />
								<Text style={[styles.actionLabel, { color: colors.text }]}>{card.frozen ? "Unfreeze" : "Freeze"}</Text>
							</TouchableOpacity>
						</View>

						{/* Card Info */}
						<InfoCard style={styles.infoCard}>
							<Text style={[styles.infoTitle, { color: colors.text }]}>Card Information</Text>
							<View style={styles.infoRow}>
								<Text style={[styles.infoLabel, { color: colors.textMuted }]}>Card Type</Text>
								<Text style={[styles.infoValue, { color: colors.text }]}>Debit Card</Text>
							</View>
							<View style={styles.infoRow}>
								<Text style={[styles.infoLabel, { color: colors.textMuted }]}>Provider</Text>
								<Text style={[styles.infoValue, { color: colors.text }]}>{card.provider}</Text>
							</View>
							<View style={styles.infoRow}>
								<Text style={[styles.infoLabel, { color: colors.textMuted }]}>Status</Text>
								<Text style={[styles.infoValue, { color: card.frozen ? colors.danger : colors.success }]}>{card.frozen ? "Frozen" : "Active"}</Text>
							</View>
						</InfoCard>
					</>
				) : (
					<>
						{/* No Card State */}
						<View style={styles.emptyState}>
							<LinearGradient colors={colors.gradients.muted} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.emptyCardPlaceholder}>
								<Ionicons name="card-outline" size={64} color="#FFFFFF" style={{ opacity: 0.5 }} />
							</LinearGradient>

							<Text style={[styles.emptyTitle, { color: colors.text }]}>No Card Yet</Text>
							<Text style={[styles.emptyText, { color: colors.textMuted }]}>Apply for a card to start making payments and transactions</Text>

							<Button title="Apply for Card" onPress={() => router.push("/(protected)/wallets/applyCard")} gradient fullWidth style={styles.applyButton} />
						</View>
					</>
				)}
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
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
	cardContainer: {
		borderRadius: 20,
		padding: 24,
		height: 200,
		justifyContent: "space-between",
		marginBottom: 20,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	cardProvider: {
		fontSize: 18,
		fontWeight: "700",
		color: "#FFFFFF",
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	frozenBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 12,
		gap: 6,
	},
	frozenText: {
		color: "#FFFFFF",
		fontSize: 12,
		fontWeight: "600",
	},
	cardNumber: {
		fontSize: 22,
		fontWeight: "600",
		color: "#FFFFFF",
		letterSpacing: 2,
	},
	cardFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
	},
	cardLabel: {
		fontSize: 10,
		color: "#FFFFFF",
		opacity: 0.7,
		marginBottom: 4,
	},
	cardExpiry: {
		fontSize: 16,
		color: "#FFFFFF",
		fontWeight: "600",
	},
	actionsGrid: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 20,
	},
	actionCard: {
		flex: 1,
		borderRadius: 16,
		padding: 20,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		gap: 8,
	},
	actionLabel: {
		fontSize: 13,
		fontWeight: "600",
	},
	infoCard: {
		marginBottom: 20,
	},
	infoTitle: {
		fontSize: 16,
		fontWeight: "700",
		marginBottom: 16,
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 10,
	},
	infoLabel: {
		fontSize: 14,
	},
	infoValue: {
		fontSize: 14,
		fontWeight: "600",
	},
	emptyState: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 40,
	},
	emptyCardPlaceholder: {
		width: 300,
		height: 180,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 24,
	},
	emptyTitle: {
		fontSize: 22,
		fontWeight: "700",
		marginBottom: 12,
		textAlign: "center",
	},
	emptyText: {
		fontSize: 15,
		textAlign: "center",
		marginBottom: 32,
		lineHeight: 22,
	},
	applyButton: {
		marginTop: 8,
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
