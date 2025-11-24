// app/(protected)/qr/generate.tsx
import { api } from "@/convex/_generated/api";
import Button from "@/components/ui/Button";
import InfoCard from "@/components/ui/InfoCard";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import QRCode from "react-native-qrcode-svg";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QRGenerateScreen() {
	const { colors } = useTheme();
	const router = useRouter();
	const [amount, setAmount] = useState("");
	const [loading, setLoading] = useState(false);
	const [generatedQR, setGeneratedQR] = useState<{ token: string; amount?: number } | null>(null);
	const generateQR = useMutation(api.qr_codes.generate.generate);

	const handleGenerate = async () => {
		const parsedAmount = amount ? parseFloat(amount) : undefined;

		if (parsedAmount && parsedAmount <= 0) {
			Alert.alert("Invalid Amount", "Please enter a valid amount");
			return;
		}

		setLoading(true);
		try {
			const result = await generateQR({
				amount: parsedAmount,
				ttlSeconds: 300, // 5 minutes expiry
			});

			setGeneratedQR({
				token: result.token,
				amount: parsedAmount,
			});

			Alert.alert("Success", "QR code generated successfully!");
		} catch (err: any) {
			Alert.alert("Error", err.message || "Failed to generate QR code");
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => {
		setGeneratedQR(null);
		setAmount("");
	};

	return (
		<Screen gradient>
			<ScrollView style={[styles.container, { backgroundColor: colors.bg }]} showsVerticalScrollIndicator={false}>
				<Text style={[styles.title, { color: colors.text }]}>Generate QR Code</Text>

				{!generatedQR ? (
					<>
						{/* Input Form */}
						<InfoCard style={styles.formCard}>
							<Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Details</Text>

							<Input
								label="Amount (Optional)"
								placeholder="Leave empty for flexible amount"
								value={amount}
								onChangeText={setAmount}
								keyboardType="numeric"
								icon="cash-outline"
							/>

							<View style={styles.infoBox}>
								<Ionicons name="information-circle-outline" size={20} color={colors.primary} />
								<Text style={[styles.infoText, { color: colors.textMuted }]}>
									{amount ? `Fixed amount QR for Rs. ${amount}` : "Flexible amount QR - payer can enter any amount"}
								</Text>
							</View>
						</InfoCard>

						{/* Features */}
						<InfoCard style={styles.featuresCard}>
							<Text style={[styles.sectionTitle, { color: colors.text }]}>QR Features</Text>

							<View style={styles.featureRow}>
								<Ionicons name="checkmark-circle" size={20} color={colors.success} />
								<Text style={[styles.featureText, { color: colors.text }]}>Expires in 5 minutes</Text>
							</View>

							<View style={styles.featureRow}>
								<Ionicons name="checkmark-circle" size={20} color={colors.success} />
								<Text style={[styles.featureText, { color: colors.text }]}>Secure one-time payment</Text>
							</View>

							<View style={styles.featureRow}>
								<Ionicons name="checkmark-circle" size={20} color={colors.success} />
								<Text style={[styles.featureText, { color: colors.text }]}>Instant notification on scan</Text>
							</View>
						</InfoCard>

						<Button title="Generate QR Code" onPress={handleGenerate} gradient fullWidth loading={loading} style={styles.generateButton} />
					</>
				) : (
					<>
						{/* Generated QR Display */}
						<InfoCard style={styles.qrCard}>
							<View style={styles.qrContainer}>
								<View style={[styles.qrWrapper, { backgroundColor: colors.surface }]}>
									<QRCode value={generatedQR.token} size={200} backgroundColor="white" />
								</View>

								{generatedQR.amount && (
									<View style={styles.amountBadge}>
										<Text style={[styles.amountText, { color: colors.text }]}>Rs. {generatedQR.amount.toLocaleString()}</Text>
									</View>
								)}
							</View>

							<Text style={[styles.qrLabel, { color: colors.textMuted }]}>Show this QR code to receive payment</Text>
						</InfoCard>

						<InfoCard style={styles.instructionsCard}>
							<Text style={[styles.instructionsTitle, { color: colors.text }]}>Instructions</Text>
							<Text style={[styles.instructionsText, { color: colors.textMuted }]}>
								• Share this QR code with the payer{"\n"}
								• They can scan it to send you money{"\n"}
								• QR expires in 5 minutes for security{"\n"}
								• You'll receive instant notification
							</Text>
						</InfoCard>

						<Button title="Generate New QR" onPress={handleReset} variant="secondary" fullWidth style={styles.newButton} />
					</>
				)}

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
	formCard: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 16,
	},
	infoBox: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginTop: 8,
	},
	infoText: {
		flex: 1,
		fontSize: 13,
		lineHeight: 18,
	},
	featuresCard: {
		marginBottom: 20,
	},
	featureRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginBottom: 12,
	},
	featureText: {
		fontSize: 14,
	},
	generateButton: {
		marginTop: 8,
	},
	qrCard: {
		marginBottom: 16,
		alignItems: "center",
		paddingVertical: 32,
	},
	qrContainer: {
		alignItems: "center",
		marginBottom: 16,
	},
	qrWrapper: {
		padding: 20,
		borderRadius: 16,
		marginBottom: 16,
	},
	amountBadge: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 12,
		backgroundColor: "rgba(127, 90, 240, 0.1)",
	},
	amountText: {
		fontSize: 20,
		fontWeight: "700",
	},
	qrLabel: {
		fontSize: 14,
		textAlign: "center",
	},
	instructionsCard: {
		marginBottom: 16,
	},
	instructionsTitle: {
		fontSize: 16,
		fontWeight: "700",
		marginBottom: 12,
	},
	instructionsText: {
		fontSize: 14,
		lineHeight: 22,
	},
	newButton: {
		marginTop: 8,
	},
});
