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
import { ActivityIndicator, Alert, Image, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
	const { colors, isDarkMode, toggleDarkMode } = useTheme();
	const { user: clerkUser } = useUser();
	const { signOut } = useAuth();
	const router = useRouter();

	// Get user data from Convex
	const convexUser = useQuery(api.users.me.me);
	const updateUser = useMutation(api.users.update.update);
	const generateUploadUrl = useMutation(api.users.uploadAvatar.generateUploadUrl);
	const saveAvatar = useMutation(api.users.uploadAvatar.saveAvatar);
	
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [avatarUri, setAvatarUri] = useState<string | null>(null);

	// Initialize form with Convex data
	useEffect(() => {
		if (convexUser) {
			const fullName = convexUser.fullName || "";
			const [first, ...rest] = fullName.split(" ");
			setFirstName(first || "");
			setLastName(rest.join(" ") || "");
			setEmail(convexUser.email || "");
			setAvatarUri(convexUser.avatar || null);
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

	const handlePickImage = async () => {
		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!permissionResult.granted) {
			Alert.alert("Permission Required", "Please allow access to your photo library");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		});

		if (!result.canceled && result.assets[0]) {
			const imageUri = result.assets[0].uri;
			setAvatarUri(imageUri);
			
			try {
				setLoading(true);
				
				// Get upload URL from Convex
				const uploadUrl = await generateUploadUrl();
				
				// Fetch the image as blob
				const response = await fetch(imageUri);
				const blob = await response.blob();
				
				// Upload to Convex storage
				const uploadResponse = await fetch(uploadUrl, {
					method: "POST",
					headers: { "Content-Type": blob.type },
					body: blob,
				});
				
				if (!uploadResponse.ok) {
					throw new Error("Failed to upload image");
				}
				
				const { storageId } = await uploadResponse.json();
				
				// Save the storage ID to user profile
				const { avatarUrl } = await saveAvatar({ storageId });
				
				setAvatarUri(avatarUrl);
				Alert.alert("Success", "Profile photo updated!");
			} catch (err: any) {
				console.error("Upload error:", err);
				Alert.alert("Error", err.message || "Failed to upload photo");
			} finally {
				setLoading(false);
			}
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
		<Screen gradient scrollable>
			<View style={styles.container}>
				{/* Profile Header */}
				<View style={styles.header}>
					<TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
						<LinearGradient colors={colors.gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar}>
							{avatarUri ? (
								<Image source={{ uri: avatarUri }} style={styles.avatarImage} />
							) : (
								<Text style={styles.avatarText}>{firstName.charAt(0) || "U"}</Text>
							)}
							<View style={styles.cameraIcon}>
								<Ionicons name="camera" size={16} color="#FFFFFF" />
							</View>
						</LinearGradient>
					</TouchableOpacity>
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
				<TouchableOpacity style={styles.actionRow} onPress={() => router.push("/wallets")}>
					<View style={styles.settingLeft}>
						<Ionicons name="wallet-outline" size={24} color={colors.text} />
						<Text style={[styles.settingLabel, { color: colors.text }]}>My Wallet</Text>
					</View>
					<Ionicons name="chevron-forward-outline" size={20} color={colors.textMuted} />
				</TouchableOpacity>

				<View style={[styles.divider, { backgroundColor: colors.border }]} />

				<TouchableOpacity style={styles.actionRow} onPress={() => router.push("/stats")}>
					<View style={styles.settingLeft}>
						<Ionicons name="stats-chart-outline" size={24} color={colors.text} />
						<Text style={[styles.settingLabel, { color: colors.text }]}>Transaction History</Text>
					</View>
					<Ionicons name="chevron-forward-outline" size={20} color={colors.textMuted} />
				</TouchableOpacity>

				<View style={[styles.divider, { backgroundColor: colors.border }]} />

				<TouchableOpacity style={styles.actionRow} onPress={() => router.push("/qr")}>
					<View style={styles.settingLeft}>
						<Ionicons name="qr-code-outline" size={24} color={colors.text} />
						<Text style={[styles.settingLabel, { color: colors.text }]}>QR Code</Text>
					</View>
					<Ionicons name="chevron-forward-outline" size={20} color={colors.textMuted} />
				</TouchableOpacity>
				</InfoCard>

				{/* Sign Out Button */}
				<TouchableOpacity 
					onPress={handleSignOut} 
					style={[styles.logoutButton, { backgroundColor: "#FF3B30" }]}
					activeOpacity={0.8}
				>
					<Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
					<Text style={styles.logoutText}>Sign Out</Text>
				</TouchableOpacity>

				<View style={{ height: 40 }} />
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
		position: "relative",
	},
	avatarImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},
	avatarText: {
		fontSize: 40,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	cameraIcon: {
		position: "absolute",
		bottom: 0,
		right: 0,
		backgroundColor: "#007AFF",
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "#FFFFFF",
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
	logoutButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 12,
		marginTop: 16,
		gap: 12,
		shadowColor: "#FF3B30",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
	},
	logoutText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "700",
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
