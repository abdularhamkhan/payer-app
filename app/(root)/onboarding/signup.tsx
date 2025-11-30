import { api } from "@/convex/_generated/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useSignUp } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
	const router = useRouter();
	const { signUp, setActive, isLoaded } = useSignUp();
	const { userId, isSignedIn } = useAuth();
	const { colors } = useTheme();
	const createUser = useMutation(api.users.create.create);
	const existingUser = useQuery(api.users.me.me);

	// If user is already signed in and has a Convex record, redirect to home
	useEffect(() => {
		if (isSignedIn && existingUser) {
			router.replace("/home");
		}
	}, [isSignedIn, existingUser]);

	const handleGoogleSignup = async () => {
		if (!isLoaded || !signUp) return;
		try {
			await signUp.authenticateWithRedirect({
				strategy: "oauth_google",
				fallbackRedirectUrl: "/(protected)/home",
			});
		} catch (err: any) {
			console.error("Google signup error:", err);
			Alert.alert("Sign Up Failed", err?.errors?.[0]?.message || "Could not sign up with Google");
		}
	};

	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [code, setCode] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [stage, setStage] = useState<"signup" | "verify">("signup");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({ email: "", phone: "", password: "" });

	const handleSignup = async () => {
		if (!isLoaded || !signUp) return;

		// Validation
		const newErrors = { email: "", phone: "", password: "" };
		if (!email) newErrors.email = "Email is required";
		if (!phone) newErrors.phone = "Phone is required";
		if (!password) newErrors.password = "Password must be at least 8 characters";
		else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";

		if (newErrors.email || newErrors.phone || newErrors.password) {
			setErrors(newErrors);
			return;
		}

		setLoading(true);
		setCode(""); // Reset code
		try {
			console.log("Creating signup with email:", email);
			
			// Create signup with email only, store phone in metadata for our app
			await signUp.create({
				emailAddress: email,
				password,
				unsafeMetadata: {
					phone: phone, // Store phone for our app (not Clerk verification)
				}
			});

			console.log("Preparing email verification");
			await signUp.prepareEmailAddressVerification({
				strategy: "email_code",
			});

			console.log("Verification email sent, moving to verify stage");
			setStage("verify");
		} catch (err: any) {
			console.error("Signup error:", err);
			Alert.alert("Signup Failed", err?.errors?.[0]?.message || "Could not create account");
		} finally {
			setLoading(false);
		}
	};

	const handleVerify = async () => {
		if (!signUp) return;

		if (!code || code.length !== 6) {
			Alert.alert("Invalid Code", "Please enter the 6-digit verification code");
			return;
		}

		setLoading(true);
		try {
			const result = await signUp.attemptEmailAddressVerification({ code });
			console.log("Verification result:", result.status, "Session:", result.createdSessionId);

			// Session should be created immediately
			if (result.createdSessionId) {
				console.log("Session created! Signing in...");
				await setActive({ session: result.createdSessionId });
				
				// Wait for auth state
				await new Promise(resolve => setTimeout(resolve, 1000));
				
				// Create Convex user
				const clerkUserId = userId || signUp.createdUserId;
				if (clerkUserId) {
					try {
						console.log("Creating Convex user...");
						await createUser({ 
							clerkUserId, 
							phone, 
							fullName: "New User", 
							email,
							firstName,
							lastName
						});
						console.log("Convex user created!");
					} catch (convexErr) {
						console.log("Convex error (user may exist):", convexErr);
					}
				}
				
				router.replace("/home");
				return;
			}
			
			// If no session, account created but needs login
			console.log("No session created, redirect to login");
			Alert.alert(
				"Success!",
				"Your account has been created. Please sign in to continue.",
				[{ text: "Sign In", onPress: () => router.replace("/onboarding/login") }]
			);
		} catch (err: any) {
			console.error("Verification error:", err);
			
			// Check if it's already verified error
			if (err?.errors?.[0]?.message?.includes("already been verified")) {
				Alert.alert(
					"Already Verified",
					"This account is already verified. Please sign in instead.",
					[{ text: "Go to Login", onPress: () => router.replace("/onboarding/login") }]
				);
			} else {
				Alert.alert("Verification Failed", err?.errors?.[0]?.message || "Invalid verification code");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Screen gradient scrollable>
			<View style={styles.container}>
				<View style={styles.content}>
					{stage === "signup" && (
						<>
							<Text style={[styles.title, { color: colors.text }]}>
								One Last Step for Financial Freedom
							</Text>

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
								label="Phone"
								placeholder="03XX-XXXXXXX"
								value={phone}
								onChangeText={(text) => {
									setPhone(text);
									setErrors({ ...errors, phone: "" });
								}}
								keyboardType="phone-pad"
								icon="call-outline"
								error={errors.phone}
							/>

							<Input
								label="Password"
								placeholder="At least 8 characters"
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
								title="Sign Up"
								onPress={handleSignup}
								gradient
								fullWidth
								loading={loading}
								style={styles.submitButton}
							/>

							<View style={styles.footer}>
								<Text style={[styles.footerText, { color: colors.textMuted }]}>or continue with</Text>
							</View>

							<TouchableOpacity 
								onPress={handleGoogleSignup}
								style={[styles.googleButton, { backgroundColor: colors.surface }]}
							>
								<Ionicons name="logo-google" size={24} color="#DB4437" />
								<Text style={[styles.googleText, { color: colors.text }]}>Sign up with Google</Text>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => router.push("/onboarding/login")} style={{ marginTop: 16 }}>
								<Text style={[styles.loginText, { color: colors.primary }]}>
									Already have an account? Login
								</Text>
							</TouchableOpacity>
						</>
					)}

					{stage === "verify" && (
						<>
							<Text style={[styles.title, { color: colors.text }]}>Enter Verification Code</Text>
							<Text style={[styles.subtitle, { color: colors.textMuted }]}>
								We sent a 6-digit code to {email}
							</Text>

							<Input
								label="Verification Code"
								placeholder="000000"
								keyboardType="numeric"
								value={code}
								onChangeText={setCode}
								maxLength={6}
								icon="key-outline"
							/>

							<Button
								title="Verify & Continue"
								onPress={handleVerify}
								gradient
								fullWidth
								loading={loading}
								style={styles.submitButton}
							/>

							<View style={styles.footer}>
								<TouchableOpacity 
									onPress={() => {
										setStage("signup");
										setCode("");
									}} 
									style={styles.backButton}
								>
									<Text style={[styles.backText, { color: colors.textMuted }]}>← Back to signup</Text>
								</TouchableOpacity>
							</View>
						</>
					)}
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
		minHeight: 600,
	},
	title: {
		fontSize: 26,
		fontWeight: "700",
		marginBottom: 12,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 15,
		marginBottom: 32,
		textAlign: "center",
	},
	submitButton: {
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
	loginText: {
		fontSize: 15,
		fontWeight: "600",
		textAlign: "center",
	},
	backButton: {
		marginTop: 24,
		alignItems: "center",
	},
	backText: {
		fontSize: 15,
	},
	googleButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 14,
		paddingHorizontal: 24,
		borderRadius: 12,
		gap: 12,
	},
	googleText: {
		fontSize: 16,
		fontWeight: "600",
	},
});
