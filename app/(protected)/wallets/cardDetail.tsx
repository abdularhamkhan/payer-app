// app/(protected)/wallets/cardDetail.tsx
import { api } from "@/convex/_generated/api";
import Button from "@/components/ui/Button";
import InfoCard from "@/components/ui/InfoCard";
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View, Clipboard } from "react-native";
import * as Haptics from "expo-haptics";

export default function CardDetailScreen() {
	const { colors } = useTheme();
	const router = useRouter();
	const card = useQuery(api.cards.get.get);
	const freezeCard = useMutation(api.cards.freeze.freeze);
	const unfreezeCard = useMutation(api.cards.unfreeze.unfreeze);
	const deleteCard = useMutation(api.cards.delete.deleteCard);
	const [loading, setLoading] = useState(false);
	const [showFullNumber, setShowFullNumber] = useState(false);

	const handleFreezeToggle = async () => {
		if (!card) return;

		const action = card.frozen ? "unfreeze" : "freeze";
		Alert.alert(
			`${action === "freeze" ? "Freeze" : "Unfreeze"} Card`,
			`Are you sure you want to ${action} this card?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: action === "freeze" ? "Freeze" : "Unfreeze",
					style: action === "freeze" ? "destructive" : "default",
					onPress: async () => {
						setLoading(true);
						try {
							if (action === "freeze") {
								await freezeCard({});
								Alert.alert("Success", "Card has been frozen");
							} else {
								await unfreezeCard({});
								Alert.alert("Success", "Card has been unfrozen");
							}
						} catch (err: any) {
							Alert.alert("Error", err.message || `Failed to ${action} card`);
						} finally {
							setLoading(false);
						}
					},
				},
			]
		);
	};

	const copyToClipboard = (text: string, label: string) => {
		Clipboard.setString(text);
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		Alert.alert("Copied", `${label} copied to clipboard`);
	};

	if (!card) {
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
				<Text style={[styles.title, { color: colors.text }]}>Card Details</Text>

				{/* Card Visual */}
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

					<TouchableOpacity onPress={() => setShowFullNumber(!showFullNumber)} activeOpacity={0.7}>
						<Text style={styles.cardNumber}>{showFullNumber ? card.cardNumber : `**** **** **** ${card.cardLast4}`}</Text>
					</TouchableOpacity>

					<View style={styles.cardFooter}>
						<View>
							<Text style={styles.cardLabel}>EXPIRY</Text>
							<Text style={styles.cardExpiry}>{card.expiry}</Text>
						</View>
						<TouchableOpacity onPress={() => setShowFullNumber(!showFullNumber)}>
							<Ionicons name={showFullNumber ? "eye-off" : "eye"} size={24} color="#FFFFFF" />
						</TouchableOpacity>
					</View>
				</LinearGradient>

				{/* Card Information */}
				<InfoCard style={styles.infoCard}>
					<Text style={[styles.sectionTitle, { color: colors.text }]}>Card Information</Text>

					<View style={styles.infoRow}>
						<View style={{ flex: 1 }}>
							<Text style={[styles.infoLabel, { color: colors.textMuted }]}>Card Number</Text>
							<Text style={[styles.infoValue, { color: colors.text }]}>{showFullNumber ? card.cardNumber : `**** **** **** ${card.cardLast4}`}</Text>
						</View>
						<TouchableOpacity onPress={() => copyToClipboard(card.cardNumber, "Card number")} style={styles.copyButton}>
							<Ionicons name="copy-outline" size={20} color={colors.primary} />
						</TouchableOpacity>
					</View>

					<View style={[styles.divider, { backgroundColor: colors.border }]} />

					<View style={styles.infoRow}>
						<View>
							<Text style={[styles.infoLabel, { color: colors.textMuted }]}>Expiry Date</Text>
							<Text style={[styles.infoValue, { color: colors.text }]}>{card.expiry}</Text>
						</View>
						<TouchableOpacity onPress={() => copyToClipboard(card.expiry, "Expiry date")} style={styles.copyButton}>
							<Ionicons name="copy-outline" size={20} color={colors.primary} />
						</TouchableOpacity>
					</View>

					<View style={[styles.divider, { backgroundColor: colors.border }]} />

					<View style={styles.infoRow}>
						<View>
							<Text style={[styles.infoLabel, { color: colors.textMuted }]}>Card Type</Text>
							<Text style={[styles.infoValue, { color: colors.text }]}>Debit Card</Text>
						</View>
					</View>

					<View style={[styles.divider, { backgroundColor: colors.border }]} />

					<View style={styles.infoRow}>
						<View>
							<Text style={[styles.infoLabel, { color: colors.textMuted }]}>Status</Text>
							<Text style={[styles.infoValue, { color: card.frozen ? colors.danger : colors.success }]}>{card.frozen ? "Frozen" : "Active"}</Text>
						</View>
					</View>
				</InfoCard>

				{/* Actions */}
				<Button
					title={card.frozen ? "Unfreeze Card" : "Freeze Card"}
					onPress={handleFreezeToggle}
					variant={card.frozen ? "primary" : "danger"}
					fullWidth
					loading={loading}
					style={styles.freezeButton}
				/>

				<TouchableOpacity 
					style={[styles.deleteButton, { borderColor: colors.danger }]}
					onPress={() => {
						Alert.alert(
							"Delete Card",
							"Are you sure you want to delete this card? This action cannot be undone.",
							[
								{ text: "Cancel", style: "cancel" },
								{
									text: "Delete",
									style: "destructive",
									onPress: async () => {
										setLoading(true);
										try {
											await deleteCard();
											Alert.alert("Deleted", "Card has been deleted successfully");
											router.back();
										} catch (err: any) {
											Alert.alert("Error", err.message || "Failed to delete card");
										} finally {
											setLoading(false);
										}
									},
								},
							]
						);
					}}
					disabled={loading}
				>
					<Ionicons name="trash-outline" size={20} color={colors.danger} />
					<Text style={[styles.deleteText, { color: colors.danger }]}>Delete Card</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
					<Text style={[styles.backText, { color: colors.textMuted }]}>← Back to Cards</Text>
				</TouchableOpacity>
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
	infoCard: {
		marginBottom: 20,
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
		fontSize: 13,
		marginBottom: 6,
	},
	infoValue: {
		fontSize: 16,
		fontWeight: "600",
	},
	copyButton: {
		padding: 8,
	},
	divider: {
		height: 1,
		marginVertical: 8,
	},
	freezeButton: {
		marginBottom: 16,
	},
	deleteButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		paddingVertical: 14,
		borderRadius: 12,
		borderWidth: 1.5,
		marginBottom: 16,
	},
	deleteText: {
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
