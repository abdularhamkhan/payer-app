// app/(protected)/profile/index.tsx
import { api } from "@/convex/_generated/api";
import Button from "@/components/ui/Button";
import InfoCard from "@/components/ui/InfoCard";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
	const { colors, isDarkMode, toggleDarkMode } = useTheme();
	const { user: clerkUser } = useUser();
	const { signOut } = useAuth();
	const router = useRouter();

	// Get user data from Convex
	const convexUser = useQuery(api.users.me.me);
	const updateUser = useMutation(api.users.update.update);
	
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	// Initialize form with Convex data
	useEffect(() => {
		if (convexUser) {
			const fullName = convexUser.fullName || "";
			const [first, ...rest] = fullName.split(" ");
			setFirstName(first || "");
			setLastName(rest.join(" ") || "");
			setEmail(convexUser.email || "");
		}
	}, [convexUser]);

	const handleUpdate = async () => {
		if (!firstName.trim()) {
			Alert.alert("Error", "First name is required");
			return;
		}

		setLoading(true);
		try {
			const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
			await updateUser({ fullName, email: email || undefined });
			Alert.alert("Success", "Profile updated successfully");
		} catch (err: any) {
			Alert.alert("Error", err.message || "Failed to update profile");
		} finally {
			setLoading(false);
		}
	};

	const handleSignOut = async () => {
		Alert.alert("Sign Out", "Are you sure you want to sign out?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Sign Out",
				style: "destructive",
				onPress: async () => {
					try {
						await signOut();
						router.replace("/onboarding/login");
					} catch (err) {
						console.error("Sign out error", err);
					}
				},
			},
		]);
	};

	if (!convexUser) {
		return (
			<Screen>
				<View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			</Screen>
		);
	}

	return (
		<Screen gradient>
			<ScrollView style={[styles.container, { backgroundColor: colors.bg }]} showsVerticalScrollIndicator={false}>
				{/* Profile Header */}
				<View style={styles.header}>
					<LinearGradient colors={colors.gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar}>
						<Text style={styles.avatarText}>{firstName.charAt(0) || "U"}</Text>
					</LinearGradient>
					<Text style={[styles.userName, { color: colors.text }]}>{convexUser.fullName}</Text>
					<Text style={[styles.userPhone, { color: colors.textMuted }]}>{convexUser.phone}</Text>
				</View>

				{/* Profile Form */}
				<InfoCard style={styles.formCard}>
					<Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>

					<Input label="First Name" placeholder="Enter first name" value={firstName} onChangeText={setFirstName} icon="person-outline" />

					<Input label="Last Name" placeholder="Enter last name" value={lastName} onChangeText={setLastName} icon="person-outline" />

					<Input
						label="Email"
						placeholder="Enter email address"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
						icon="mail-outline"
					/>

					<Button title="Update Profile" onPress={handleUpdate} gradient fullWidth loading={loading} style={styles.updateButton} />
				</InfoCard>

				{/* Settings */}
				<InfoCard style={styles.settingsCard}>
					<Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>

					<View style={styles.settingRow}>
						<View style={styles.settingLeft}>
							<Ionicons name={isDarkMode ? "moon" : "sunny"} size={24} color={colors.text} />
							<Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
						</View>
						<Switch value={isDarkMode} onValueChange={toggleDarkMode} trackColor={{ false: colors.border, true: colors.primary }} />
					</View>
				</InfoCard>

				{/* Quick Actions */}
				<InfoCard style={styles.actionsCard}>
					<TouchableOpacity style={styles.actionRow} onPress={() => router.push("/(protected)/wallets")}>
						<View style={styles.settingLeft}>
							<Ionicons name="card-outline" size={24} color={colors.text} />
							<Text style={[styles.settingLabel, { color: colors.text }]}>My Cards</Text>
						</View>
						<Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
					</TouchableOpacity>

					<View style={[styles.divider, { backgroundColor: colors.border }]} />

					<TouchableOpacity style={styles.actionRow} onPress={() => router.push("/(protected)/stats")}>
						<View style={styles.settingLeft}>
							<Ionicons name="bar-chart-outline" size={24} color={colors.text} />
							<Text style={[styles.settingLabel, { color: colors.text }]}>Transaction History</Text>
						</View>
						<Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
					</TouchableOpacity>

					<View style={[styles.divider, { backgroundColor: colors.border }]} />

					<TouchableOpacity style={styles.actionRow} onPress={() => router.push("/(protected)/qr")}>
						<View style={styles.settingLeft}>
							<Ionicons name="qr-code-outline" size={24} color={colors.text} />
							<Text style={[styles.settingLabel, { color: colors.text }]}>QR Code</Text>
						</View>
						<Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
					</TouchableOpacity>
				</InfoCard>

				{/* Sign Out Button */}
				<Button title="Sign Out" onPress={handleSignOut} variant="danger" fullWidth style={styles.signoutButton} />

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
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	header: {
		alignItems: "center",
		marginBottom: 24,
		marginTop: 20,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
	},
	avatarText: {
		fontSize: 40,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	userName: {
		fontSize: 24,
		fontWeight: "700",
		marginBottom: 6,
	},
	userPhone: {
		fontSize: 15,
	},
	formCard: {
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 16,
	},
	updateButton: {
		marginTop: 8,
	},
	settingsCard: {
		marginBottom: 16,
	},
	settingRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 8,
	},
	settingLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	settingLabel: {
		fontSize: 16,
		fontWeight: "600",
	},
	actionsCard: {
		marginBottom: 16,
	},
	actionRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 12,
	},
	divider: {
		height: 1,
		marginVertical: 8,
	},
	signoutButton: {
		marginTop: 8,
	},
});


// // app/(protected)/profile/index.tsx
// import Screen from "@/components/ui/Screen";
// import useTheme from "@/hooks/useTheme";
// import { useAuth } from "@clerk/clerk-expo";
// import { useRouter } from "expo-router";
// import React from "react";
// import { Text, TouchableOpacity, View } from "react-native";

// export default function ProfileScreen() {
//   const { colors, isDarkMode, toggleDarkMode } = useTheme();
//   const { signOut } = useAuth();
//   const router = useRouter();

//   const handleSignOut = async () => {
//     await signOut();
//     router.replace("/onboarding/login");
//   };

//   return (
//     <Screen>
//       <View style={{ padding: 16 }}>
//         <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>Profile</Text>

//         <TouchableOpacity onPress={toggleDarkMode} style={{ marginTop: 16 }}>
//           <Text style={{ color: colors.primary }}>Toggle Theme (current: {isDarkMode ? "dark" : "light"})</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={handleSignOut} style={{ marginTop: 16 }}>
//           <Text style={{ color: colors.danger }}>Sign out</Text>
//         </TouchableOpacity>
//       </View>
//     </Screen>
//   );
// }
