// app/(root)/index.tsx
import useTheme from "@/hooks/useTheme";
import { useAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

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
			<Image 
				source={require('@/assets/images/payer.png')} 
				style={styles.logo}
				resizeMode="contain"
			/>
			<ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	logo: {
		width: 200,
		height: 200,
		marginBottom: 24,
	},
	loader: {
		marginTop: 24,
	},
});
