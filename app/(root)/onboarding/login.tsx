// app/(root)/onboarding/login.tsx
import { api } from "@/convex/_generated/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { useAuth, useSignIn, useUser } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
	const router = useRouter();
	const { signIn, setActive, isLoaded } = useSignIn();
	const { userId } = useAuth();
	const { user } = useUser();
	const { colors } = useTheme();
	const createUser = useMutation(api.users.create.create);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({ email: "", password: "" });

	const handleLogin = async () => {
		if (!isLoaded) return;

		// Validation
		const newErrors = { email: "", password: "" };
		if (!email) newErrors.email = "Email is required";
		if (!password) newErrors.password = "Password is required";

		if (newErrors.email || newErrors.password) {
			setErrors(newErrors);
			return;
		}

		setLoading(true);
		try {
			const result = await signIn.create({
				identifier: email,
				password,
			});

			await setActive({ session: result.createdSessionId });
			
			// Wait for auth state to update
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Try to ensure user exists in Convex (in case they signed up but Convex user creation failed)
			if (userId || user?.id) {
				try {
					await createUser({
						clerkUserId: userId || user!.id,
						phone: user?.phoneNumbers?.[0]?.phoneNumber || "",
						fullName: user?.fullName || "User",
						email: user?.primaryEmailAddress?.emailAddress || email,
					});
				} catch (convexErr) {
					// User might already exist, which is fine
					console.log("User already exists in Convex or will be created by webhook");
				}
			}
			
			router.replace("/(protected)/home");
		} catch (err: any) {
			console.log("Login error:", err);
			Alert.alert("Login Failed", err?.errors?.[0]?.message || "Invalid email or password");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Screen gradient scrollable>
			<View style={styles.container}>
				<View style={styles.content}>
					<Text style={[styles.title, { color: colors.text }]}>Happy to see you again.</Text>

					<Input
						label="Email"
						placeholder="Enter your email"
						value={email}
						onChangeText={(text) => {
							setEmail(text);
							setErrors({ ...errors, email: "" });
						}}
						autoCapitalize="none"
						keyboardType="email-address"
						icon="mail-outline"
						error={errors.email}
					/>

					<Input
						label="Password"
						placeholder="Enter your password"
						secureTextEntry
						value={password}
						onChangeText={(text) => {
							setPassword(text);
							setErrors({ ...errors, password: "" });
						}}
						icon="lock-closed-outline"
						error={errors.password}
					/>

					<Button
						title="Login"
						onPress={handleLogin}
						gradient
						fullWidth
						loading={loading}
						style={styles.loginButton}
					/>

					<View style={styles.footer}>
						<Text style={[styles.footerText, { color: colors.textMuted }]}>or</Text>
					</View>

					<TouchableOpacity onPress={() => router.push("/onboarding/signup")}>
						<Text style={[styles.signupText, { color: colors.primary }]}>
							Don't have an account? Sign Up
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		minHeight: '100%',
	},
	content: {
		flex: 1,
		justifyContent: "center",
		minHeight: 500,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		marginBottom: 32,
		textAlign: "center",
	},
	loginButton: {
		marginTop: 8,
	},
	footer: {
		marginTop: 24,
		marginBottom: 16,
		alignItems: "center",
	},
	footerText: {
		fontSize: 14,
	},
	signupText: {
		fontSize: 15,
		fontWeight: "600",
		textAlign: "center",
	},
});

// const styles = {
//         container: { flex: 1, padding: 16 },
//         subtitle: { fontSize: 18, marginBottom: 12 },
//         inputBox: { height: 48, borderWidth: 1, borderRadius: 8, marginBottom: 12, paddingHorizontal: 12 },
//         button: { height: 48, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: "#7F5AF0" },
//         buttonText: { color: "white", fontWeight: "700" },
// };
