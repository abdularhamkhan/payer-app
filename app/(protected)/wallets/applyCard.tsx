// app/(protected)/wallets/applyCard.tsx
import { api } from "@/convex/_generated/api";
import Button from "@/components/ui/Button";
import InfoCard from "@/components/ui/InfoCard";
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ApplyCardScreen() {
	const { colors } = useTheme();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const createCard = useMutation(api.cards.create.create);

	const handleApply = async () => {
		setLoading(true);
		try {
			const result = await createCard({});
			Alert.alert("Success!", "Your card application has been approved! Your new card is ready to use.", [
				{
					text: "View Card",
					onPress: () => router.replace("/(protected)/wallets"),
				},
			]);
		} catch (err: any) {
			Alert.alert("Application Failed", err.message || "Failed to create card");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Screen gradient>
			<ScrollView style={[styles.container, { backgroundColor: colors.bg }]} showsVerticalScrollIndicator={false}>
				<Text style={[styles.title, { color: colors.text }]}>Apply for Card</Text>

				{/* Card Preview */}
				<LinearGradient colors={colors.gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardPreview}>
					<Text style={styles.cardProvider}>VISA</Text>
					<Text style={styles.cardNumber}>**** **** **** ****</Text>
					<View style={styles.cardFooter}>
						<View>
							<Text style={styles.cardLabel}>CARD HOLDER</Text>
							<Text style={styles.cardHolderName}>YOUR NAME</Text>
						</View>
						<Ionicons name="card" size={40} color="#FFFFFF" style={{ opacity: 0.8 }} />
					</View>
				</LinearGradient>

				{/* Benefits */}
				<InfoCard style={styles.benefitsCard}>
					<Text style={[styles.sectionTitle, { color: colors.text }]}>Card Benefits</Text>

					<View style={styles.benefitRow}>
						<Ionicons name="checkmark-circle" size={24} color={colors.success} />
						<Text style={[styles.benefitText, { color: colors.text }]}>Instant card issuance</Text>
					</View>

					<View style={styles.benefitRow}>
						<Ionicons name="checkmark-circle" size={24} color={colors.success} />
						<Text style={[styles.benefitText, { color: colors.text }]}>No annual fees</Text>
					</View>

					<View style={styles.benefitRow}>
						<Ionicons name="checkmark-circle" size={24} color={colors.success} />
						<Text style={[styles.benefitText, { color: colors.text }]}>Secure transactions</Text>
					</View>

					<View style={styles.benefitRow}>
						<Ionicons name="checkmark-circle" size={24} color={colors.success} />
						<Text style={[styles.benefitText, { color: colors.text }]}>Freeze/unfreeze anytime</Text>
					</View>

					<View style={styles.benefitRow}>
						<Ionicons name="checkmark-circle" size={24} color={colors.success} />
						<Text style={[styles.benefitText, { color: colors.text }]}>Real-time notifications</Text>
					</View>
				</InfoCard>

				{/* Terms */}
				<InfoCard style={styles.termsCard}>
					<Text style={[styles.sectionTitle, { color: colors.text }]}>Terms & Conditions</Text>
					<Text style={[styles.termsText, { color: colors.textMuted }]}>
						By applying for this card, you agree to our terms of service and privacy policy. This card is subject to approval and will be
						issued instantly upon acceptance.
					</Text>
				</InfoCard>

				<Button title="Apply for Card" onPress={handleApply} gradient fullWidth loading={loading} style={styles.applyButton} />

				<View style={{ height: 40 }} />
			</ScrollView>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
		marginBottom: 20,
	},
	cardPreview: {
		borderRadius: 20,
		padding: 24,
		height: 200,
		justifyContent: "space-between",
		marginBottom: 20,
	},
	cardProvider: {
		fontSize: 18,
		fontWeight: "700",
		color: "#FFFFFF",
		textTransform: "uppercase",
		letterSpacing: 1,
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
	cardHolderName: {
		fontSize: 14,
		color: "#FFFFFF",
		fontWeight: "600",
	},
	benefitsCard: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 16,
	},
	benefitRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginBottom: 12,
	},
	benefitText: {
		fontSize: 15,
	},
	termsCard: {
		marginBottom: 20,
	},
	termsText: {
		fontSize: 14,
		lineHeight: 22,
	},
	applyButton: {
		marginTop: 8,
	},
});
