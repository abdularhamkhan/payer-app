// app/(protected)/notifications/index.tsx
import { api } from "@/convex/_generated/api";
import InfoCard from "@/components/ui/InfoCard";
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { Id } from "@/convex/_generated/dataModel";

export default function NotificationsScreen() {
	const { colors } = useTheme();
	const notifications = useQuery(api.notifications.list.list);
	const markAsRead = useMutation(api.notifications.markRead.markRead);
	const markAllAsRead = useMutation(api.notifications.markAllRead.markAllRead);

	const handleNotificationPress = async (notificationId: Id<"notifications">, title: string, message: string) => {
		try {
			await markAsRead({ notificationId });
			Toast.show({
				type: "success",
				text1: title,
				text2: message,
				position: "top",
				visibilityTime: 3000,
			});
		} catch (err) {
			console.error("Error marking notification as read:", err);
		}
	};

	const handleMarkAllRead = async () => {
		try {
			await markAllAsRead();
			Toast.show({
				type: "success",
				text1: "All notifications marked as read",
				position: "top",
				visibilityTime: 2000,
			});
		} catch (err) {
			console.error("Error marking all as read:", err);
		}
	};

	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);

		if (minutes < 1) return "Just now";
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;
		return date.toLocaleDateString();
	};

	if (notifications === undefined) {
		return (
			<Screen>
				<View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			</Screen>
		);
	}

	const unreadCount = notifications?.filter(n => !n.read).length || 0;

	return (
		<Screen gradient scrollable>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
					{unreadCount > 0 && (
						<TouchableOpacity onPress={handleMarkAllRead}>
							<Text style={[styles.markAllRead, { color: colors.primary }]}>Mark all read</Text>
						</TouchableOpacity>
					)}
				</View>

				{unreadCount > 0 && (
					<View style={[styles.badge, { backgroundColor: colors.primary + "20" }]}>
						<Text style={[styles.badgeText, { color: colors.primary }]}>
							{unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
						</Text>
					</View>
				)}

				{notifications && notifications.length > 0 ? (
					notifications.map((notification) => (
						<TouchableOpacity
							key={notification._id}
							onPress={() => handleNotificationPress(notification._id, notification.title, notification.message)}
						>
							<InfoCard style={[styles.notificationCard, !notification.read && { backgroundColor: colors.primary + "10" }]}>
								<View style={styles.notificationContent}>
									<View style={[styles.iconContainer, { backgroundColor: colors.primary + "20" }]}>
										<Ionicons
											name={
												notification.title.includes("Received")
													? "arrow-down"
													: notification.title.includes("Sent")
													? "arrow-up"
													: notification.title.includes("Card")
													? "card"
													: notification.title.includes("Topped")
													? "wallet"
													: "notifications"
											}
											size={24}
											color={colors.primary}
										/>
									</View>
									<View style={styles.textContainer}>
										<View style={styles.titleRow}>
											<Text style={[styles.notificationTitle, { color: colors.text }]}>{notification.title}</Text>
											{!notification.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
										</View>
										<Text style={[styles.notificationMessage, { color: colors.textMuted }]} numberOfLines={2}>
											{notification.message}
										</Text>
										<Text style={[styles.notificationTime, { color: colors.textMuted }]}>
											{formatDate(notification.createdAt)}
										</Text>
									</View>
								</View>
							</InfoCard>
						</TouchableOpacity>
					))
				) : (
					<View style={styles.emptyState}>
						<Ionicons name="notifications-off-outline" size={64} color={colors.textMuted} />
						<Text style={[styles.emptyText, { color: colors.textMuted }]}>No notifications yet</Text>
						<Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
							You'll see updates about your transactions here
						</Text>
					</View>
				)}
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
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
	},
	markAllRead: {
		fontSize: 14,
		fontWeight: "600",
	},
	badge: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		marginBottom: 16,
	},
	badgeText: {
		fontSize: 14,
		fontWeight: "600",
		textAlign: "center",
	},
	notificationCard: {
		marginBottom: 12,
	},
	notificationContent: {
		flexDirection: "row",
		gap: 12,
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
	},
	textContainer: {
		flex: 1,
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 4,
	},
	notificationTitle: {
		fontSize: 16,
		fontWeight: "600",
	},
	unreadDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	notificationMessage: {
		fontSize: 14,
		marginBottom: 4,
		lineHeight: 20,
	},
	notificationTime: {
		fontSize: 12,
	},
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 80,
	},
	emptyText: {
		fontSize: 18,
		fontWeight: "600",
		marginTop: 16,
	},
	emptySubtext: {
		fontSize: 14,
		marginTop: 8,
		textAlign: "center",
	},
});
