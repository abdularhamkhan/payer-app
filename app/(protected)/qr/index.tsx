// app/(protected)/qr/index.tsx
import Button from "@/components/ui/Button";
import InfoCard from "@/components/ui/InfoCard";
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QRScreen() {
	const { colors } = useTheme();
	const router = useRouter();
	const [scannedData, setScannedData] = useState<string | null>(null);

	const handleScan = () => {
		// In a real app, this would open the camera and scan
		// For now, we'll show a placeholder message
		Alert.alert("QR Scanner", "Camera scanning would be integrated here using expo-camera or expo-barcode-scanner");
	};

	return (
		<Screen gradient>
			<View style={[styles.container, { backgroundColor: colors.bg }]}>
				<Text style={[styles.title, { color: colors.text }]}>QR Code</Text>

				{/* Scanner Area */}
				<TouchableOpacity activeOpacity={0.9} onPress={handleScan}>
					<LinearGradient colors={colors.gradients.muted} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.scannerArea}>
						<View style={styles.scannerFrame}>
							<View style={[styles.corner, styles.cornerTL, { borderColor: colors.primary }]} />
							<View style={[styles.corner, styles.cornerTR, { borderColor: colors.primary }]} />
							<View style={[styles.corner, styles.cornerBL, { borderColor: colors.primary }]} />
							<View style={[styles.corner, styles.cornerBR, { borderColor: colors.primary }]} />
							<Ionicons name="qr-code-outline" size={80} color="#FFFFFF" style={{ opacity: 0.5 }} />
						</View>
						<Text style={styles.scannerText}>Tap to scan QR code</Text>
						<Text style={styles.scannerSubtext}>Camera will open for scanning</Text>
					</LinearGradient>
				</TouchableOpacity>

				{/* Quick Actions */}
				<View style={styles.actionsGrid}>
					<TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push("/(protected)/qr/generate")}>
						<View style={[styles.actionIcon, { backgroundColor: colors.primary + "20" }]}>
							<Ionicons name="add-circle-outline" size={28} color={colors.primary} />
						</View>
						<Text style={[styles.actionLabel, { color: colors.text }]}>Generate QR</Text>
					</TouchableOpacity>

					<TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push("/(protected)/qr/history")}>
						<View style={[styles.actionIcon, { backgroundColor: colors.primary + "20" }]}>
							<Ionicons name="time-outline" size={28} color={colors.primary} />
						</View>
						<Text style={[styles.actionLabel, { color: colors.text }]}>QR History</Text>
					</TouchableOpacity>
				</View>

				{/* How it Works */}
				<InfoCard style={styles.infoCard}>
					<Text style={[styles.infoTitle, { color: colors.text }]}>How QR Payments Work</Text>

					<View style={styles.infoRow}>
						<View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
							<Text style={styles.stepNumberText}>1</Text>
						</View>
						<Text style={[styles.infoText, { color: colors.textMuted }]}>Generate or scan a QR code</Text>
					</View>

					<View style={styles.infoRow}>
						<View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
							<Text style={styles.stepNumberText}>2</Text>
						</View>
						<Text style={[styles.infoText, { color: colors.textMuted }]}>Confirm the payment amount</Text>
					</View>

					<View style={styles.infoRow}>
						<View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
							<Text style={styles.stepNumberText}>3</Text>
						</View>
						<Text style={[styles.infoText, { color: colors.textMuted }]}>Complete the transaction instantly</Text>
					</View>
				</InfoCard>
			</View>
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
	scannerArea: {
		borderRadius: 20,
		padding: 40,
		height: 320,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	scannerFrame: {
		width: 200,
		height: 200,
		position: "relative",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	corner: {
		position: "absolute",
		width: 40,
		height: 40,
		borderWidth: 4,
	},
	cornerTL: {
		top: 0,
		left: 0,
		borderRightWidth: 0,
		borderBottomWidth: 0,
		borderTopLeftRadius: 12,
	},
	cornerTR: {
		top: 0,
		right: 0,
		borderLeftWidth: 0,
		borderBottomWidth: 0,
		borderTopRightRadius: 12,
	},
	cornerBL: {
		bottom: 0,
		left: 0,
		borderRightWidth: 0,
		borderTopWidth: 0,
		borderBottomLeftRadius: 12,
	},
	cornerBR: {
		bottom: 0,
		right: 0,
		borderLeftWidth: 0,
		borderTopWidth: 0,
		borderBottomRightRadius: 12,
	},
	scannerText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 6,
	},
	scannerSubtext: {
		color: "#FFFFFF",
		fontSize: 14,
		opacity: 0.7,
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
		borderWidth: 1,
		gap: 12,
	},
	actionIcon: {
		width: 56,
		height: 56,
		borderRadius: 28,
		justifyContent: "center",
		alignItems: "center",
	},
	actionLabel: {
		fontSize: 14,
		fontWeight: "600",
	},
	infoCard: {
		marginBottom: 20,
	},
	infoTitle: {
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 16,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
		marginBottom: 16,
	},
	stepNumber: {
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
	},
	stepNumberText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "700",
	},
	infoText: {
		flex: 1,
		fontSize: 14,
	},
});


// // app/(protected)/qr/index.tsx
// import Screen from "@/components/ui/Screen";
// import React from "react";
// import { Text, View } from "react-native";

// export default function QRScreen() {
//   return (
//     <Screen>
//       <View style={{ padding: 16 }}>
//         <Text style={{ fontSize: 18, fontWeight: "700" }}>QR Scanner & Generator</Text>
//         <Text style={{ marginTop: 12 }}>Placeholder: we'll integrate expo-barcode-scanner for scanning and your QR generation APIs.</Text>
//       </View>
//     </Screen>
//   );
// }
