// app/(root)/index.tsx
import useTheme from "@/hooks/useTheme";
import { useAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Splash() {
	const router = useRouter();
	const { isSignedIn, isLoaded } = useAuth();
	const { colors } = useTheme();

	useEffect(() => {
		(async () => {
			// Wait for Clerk to initialize
			if (!isLoaded) return;

			const seen = await AsyncStorage.getItem("seen_onboarding");

			if (!seen) {
				// first time -> onboarding slider
				router.replace("/onboarding/onboardingSlider");
				return;
			}

			// If user signed into Clerk -> protected area, else login
			if (isSignedIn) {
				router.replace("/(protected)/home");
			} else {
				router.replace("/onboarding/login");
			}
		})();
	}, [isLoaded, isSignedIn]);

	return (
		<LinearGradient
			colors={colors.gradients.primary}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={styles.container}
		>
			<View style={[styles.logoCircle, { borderColor: colors.card }]}>
				<Text style={[styles.logoText, { color: colors.card }]}>Payer</Text>
			</View>
			<ActivityIndicator size="large" color={colors.card} style={styles.loader} />
			<Text style={[styles.tagline, { color: colors.card }]}>Your Digital Wallet</Text>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	logoCircle: {
		width: 140,
		height: 140,
		borderRadius: 70,
		borderWidth: 5,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 24,
	},
	logoText: {
		fontSize: 32,
		fontWeight: "800",
	},
	loader: {
		marginTop: 16,
	},
	tagline: {
		fontSize: 16,
		fontWeight: "600",
		marginTop: 16,
		opacity: 0.9,
	},
});
