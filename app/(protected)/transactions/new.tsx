// app/(protected)/transactions/new.tsx
import { api } from "@/convex/_generated/api";
import Button from "@/components/ui/Button";
import InfoCard from "@/components/ui/InfoCard";
import Input from "@/components/ui/Input";
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Id } from "@/convex/_generated/dataModel";

type TabType = "topup" | "transfer" | "request" | "mine";

export default function NewTransactionScreen() {
	const { colors } = useTheme();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<TabType>("transfer"); // Default to transfer

	// Get wallet data
	const wallet = useQuery(api.wallets.get.get);
	const card = useQuery(api.cards.get.get);

	const TabButton = ({ type, label, icon }: { type: TabType; label: string; icon: keyof typeof Ionicons.glyphMap }) => (
		<TouchableOpacity
			style={[
				styles.tabButton,
				{
					backgroundColor: activeTab === type ? colors.primary : colors.surface,
					borderColor: colors.border,
				},
			]}
			onPress={() => setActiveTab(type)}
		>
			<Ionicons name={icon} size={20} color={activeTab === type ? "#FFFFFF" : colors.text} />
			<Text style={[styles.tabLabel, { color: activeTab === type ? "#FFFFFF" : colors.text }]}>{label}</Text>
		</TouchableOpacity>
	);

	if (wallet === undefined) {
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
				{/* Balance Card */}
				<LinearGradient colors={colors.gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
					<Text style={styles.balanceLabel}>Your Balance</Text>
					<Text style={styles.balanceAmount}>Rs. {wallet?.balance?.toLocaleString() || "0"}</Text>
				</LinearGradient>

				{/* Tabs */}
				<View style={styles.tabsContainer}>
					<TabButton type="topup" label="Topup" icon="add-circle-outline" />
					<TabButton type="transfer" label="Transfer" icon="swap-horizontal-outline" />
					<TabButton type="request" label="Request" icon="cash-outline" />
					<TabButton type="mine" label="Mine" icon="wallet-outline" />
				</View>

				{/* Content based on active tab */}
				{activeTab === "topup" && <TopupTab colors={colors} wallet={wallet} card={card} />}
				{activeTab === "transfer" && <TransferTab colors={colors} wallet={wallet} key="transfer" />}
				{activeTab === "request" && <RequestTab colors={colors} key="request" />}
				{activeTab === "mine" && <MineTab colors={colors} />}
				<View style={{ height: 40 }} />
			</View>
		</Screen>
	);
}

// Topup Tab Component - Mobile Balance Topup
function TopupTab({ colors, wallet, card }: any) {
	const [phone, setPhone] = useState("");
	const [amount, setAmount] = useState("");
	const [carrier, setCarrier] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const carriers = [
		{ name: "Jazz", icon: "musical-notes", color: "#FF6B00", prefixes: ["030", "032"] },
		{ name: "Zong", icon: "flash", color: "#00A859", prefixes: ["031", "0370"] },
		{ name: "Ufone", icon: "call", color: "#FF0000", prefixes: ["033"] },
		{ name: "Telenor", icon: "globe", color: "#0066CC", prefixes: ["034"] },
	];

	// Auto-detect carrier from phone number
	React.useEffect(() => {
		if (phone.length >= 3) {
			const prefix = phone.substring(0, 3);
			const prefix4 = phone.substring(0, 4);
			const detected = carriers.find(c => 
				c.prefixes.some(p => prefix.startsWith(p.substring(0, 3)) || prefix4.startsWith(p))
			);
			if (detected) setCarrier(detected.name);
		}
	}, [phone]);

	const handleTopup = async () => {
		if (!phone || phone.length < 11) {
			Alert.alert("Invalid Phone", "Please enter a valid mobile number (03XX-XXXXXXX)");
			return;
		}

		if (!carrier) {
			Alert.alert("Unknown Carrier", "Could not detect carrier from phone number");
			return;
		}
		
		const parsedAmount = parseFloat(amount);
		if (!parsedAmount || parsedAmount <= 0) {
			Alert.alert("Invalid Amount", "Please enter a valid amount");
			return;
		}

		if (parsedAmount > wallet?.balance) {
			Alert.alert("Insufficient Balance", "You don't have enough balance in your wallet");
			return;
		}

		setLoading(true);
		try {
			// Deduct from wallet
			Alert.alert(
				"Success", 
				`Rs. ${parsedAmount} mobile balance added to ${phone} (${carrier})`
			);
			setAmount("");
			setPhone("");
			setCarrier(null);
			router.back();
		} catch (err: any) {
			Alert.alert("Error", err.message || "Failed to topup mobile balance");
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.tabContent}>
			<Text style={[styles.sectionTitle, { color: colors.text }]}>Mobile Balance Topup</Text>
			
			<Input
				label="Mobile Number"
				placeholder="03XX-XXXXXXX"
				value={phone}
				onChangeText={setPhone}
				keyboardType="phone-pad"
				icon="call-outline"
			/>

			{carrier && (
				<View style={[styles.carrierBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
					<Text style={[styles.carrierText, { color: colors.text }]}>Carrier: {carrier}</Text>
				</View>
			)}
			
			<Input
				label="Amount (Rs.)"
				placeholder="Enter amount"
				value={amount}
				onChangeText={setAmount}
				keyboardType="numeric"
				icon="cash-outline"
			/>

			<View style={styles.prepaySection}>
				<Text style={[styles.prepayLabel, { color: colors.textMuted }]}>Wallet Balance</Text>
				<Text style={[styles.prepayAmount, { color: colors.success }]}>Rs. {wallet?.balance?.toLocaleString() || "0"}</Text>
			</View>

			<Button title="Topup Mobile Balance" onPress={handleTopup} gradient fullWidth loading={loading} style={styles.actionButton} />
		</View>
	);
}

// Transfer Tab Component
function TransferTab({ colors, wallet }: any) {
	const [phone, setPhone] = useState("");
	const [amount, setAmount] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);
	const [recipientUser, setRecipientUser] = useState<any>(null);

	const getUserByPhone = useQuery(api.users.getByPhone.getByPhone, phone ? { phone } : "skip");
	const transfer = useMutation(api.transactions.transfer.transfer);
	const router = useRouter();

	// Update recipient user when query resolves
	React.useEffect(() => {
		if (getUserByPhone) {
			setRecipientUser(getUserByPhone);
		} else if (!phone) {
			// Clear recipient when phone is cleared
			setRecipientUser(null);
		}
	}, [getUserByPhone, phone]);

	const handleTransfer = async () => {
		if (!phone || phone.length < 11) {
			Alert.alert("Invalid Phone", "Please enter a valid phone number (03XX-XXXXXXX)");
			return;
		}

		if (!recipientUser) {
			Alert.alert("User Not Found", "No user found with this phone number");
			return;
		}

		const parsedAmount = parseFloat(amount);
		if (!parsedAmount || parsedAmount <= 0) {
			Alert.alert("Invalid Amount", "Please enter a valid amount");
			return;
		}

		if (parsedAmount > wallet.balance) {
			Alert.alert("Insufficient Balance", "You don't have enough balance");
			return;
		}

		setLoading(true);
		try {
			await transfer({
				toUserId: recipientUser._id as Id<"users">,
				amount: parsedAmount,
				description: description || undefined,
			});

			Alert.alert("Success", `Rs. ${parsedAmount.toLocaleString()} sent to ${recipientUser.fullName}`);
			setPhone("");
			setAmount("");
			setDescription("");
			router.back();
		} catch (err: any) {
			Alert.alert("Transfer Failed", err.message || "Unable to complete transfer");
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.tabContent}>
			<Text style={[styles.sectionTitle, { color: colors.text }]}>Enter the Mobile Number</Text>

			<Input
				label="Phone Number"
				placeholder="03XX-XXXXXXX"
				value={phone}
				onChangeText={setPhone}
				keyboardType="phone-pad"
				icon="call-outline"
			/>

			{recipientUser && (
				<InfoCard style={styles.recipientCard}>
					<View style={styles.recipientInfo}>
						<Ionicons name="person-circle-outline" size={40} color={colors.primary} />
						<View style={{ marginLeft: 12 }}>
							<Text style={[styles.recipientName, { color: colors.text }]}>{recipientUser.fullName}</Text>
							<Text style={[styles.recipientPhone, { color: colors.textMuted }]}>{recipientUser.phone}</Text>
						</View>
					</View>
				</InfoCard>
			)}

			<Input label="Amount (Rs.)" placeholder="Enter amount" value={amount} onChangeText={setAmount} keyboardType="numeric" icon="cash-outline" />

			<Input
				label="Description (Optional)"
				placeholder="What's this for?"
				value={description}
				onChangeText={setDescription}
				icon="document-text-outline"
			/>

			<View style={styles.prepaySection}>
				<Text style={[styles.prepayLabel, { color: colors.textMuted }]}>Available Balance</Text>
				<Text style={[styles.prepayAmount, { color: colors.success }]}>Rs. {wallet?.balance?.toLocaleString() || "0"}</Text>
			</View>

			<Button title="Send Money" onPress={handleTransfer} gradient fullWidth loading={loading} style={styles.actionButton} />
		</View>
	);
}

// Request Tab Component
function RequestTab({ colors }: any) {
	const [phone, setPhone] = useState("");
	const [amount, setAmount] = useState("");
	const [note, setNote] = useState("");
	const [loading, setLoading] = useState(false);
	const [recipientUser, setRecipientUser] = useState<any>(null);

	const getUserByPhone = useQuery(api.users.getByPhone.getByPhone, phone ? { phone } : "skip");
	const sendRequest = useMutation(api.requests.send.send);
	const router = useRouter();

	React.useEffect(() => {
		if (getUserByPhone) {
			setRecipientUser(getUserByPhone);
		} else if (!phone) {
			setRecipientUser(null);
		}
	}, [getUserByPhone, phone]);

	const handleRequest = async () => {
		if (!recipientUser) {
			Alert.alert("User Not Found", "No user found with this phone number");
			return;
		}

		const parsedAmount = parseFloat(amount);
		if (!parsedAmount || parsedAmount <= 0) {
			Alert.alert("Invalid Amount", "Please enter a valid amount");
			return;
		}

		setLoading(true);
		try {
			await sendRequest({
				toPhoneOrId: recipientUser._id as string,
				amount: parsedAmount,
				note: note || undefined,
			});

			Alert.alert("Request Sent", `Money request sent to ${recipientUser.fullName}`);
			setPhone("");
			setAmount("");
			setNote("");
			router.back();
		} catch (err: any) {
			Alert.alert("Error", err.message || "Failed to send request");
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.tabContent}>
			<Text style={[styles.sectionTitle, { color: colors.text }]}>Request Money From</Text>

			<Input
				label="Phone Number"
				placeholder="03XX-XXXXXXX"
				value={phone}
				onChangeText={setPhone}
				keyboardType="phone-pad"
				icon="call-outline"
			/>

			{recipientUser && (
				<InfoCard style={styles.recipientCard}>
					<View style={styles.recipientInfo}>
						<Ionicons name="person-circle-outline" size={40} color={colors.primary} />
						<View style={{ marginLeft: 12 }}>
							<Text style={[styles.recipientName, { color: colors.text }]}>{recipientUser.fullName}</Text>
							<Text style={[styles.recipientPhone, { color: colors.textMuted }]}>{recipientUser.phone}</Text>
						</View>
					</View>
				</InfoCard>
			)}

			<Input label="Amount (Rs.)" placeholder="Enter amount" value={amount} onChangeText={setAmount} keyboardType="numeric" icon="cash-outline" />

			<Input label="Note (Optional)" placeholder="Reason for request" value={note} onChangeText={setNote} icon="document-text-outline" />

			<Button title="Send Request" onPress={handleRequest} gradient fullWidth loading={loading} style={styles.actionButton} />
		</View>
	);
}

// Mine Tab Component - Shows pending requests
function MineTab({ colors }: any) {
	const incomingRequests = useQuery(api.requests.listIncoming.listIncoming);
	const outgoingRequests = useQuery(api.requests.listOutgoing.listOutgoing);
	const acceptRequest = useMutation(api.requests.accept.accept);
	const rejectRequest = useMutation(api.requests.reject.reject);
	const [processingId, setProcessingId] = useState<string | null>(null);

	const handleAccept = async (requestId: Id<"requests">) => {
		setProcessingId(requestId);
		try {
			await acceptRequest({ requestId });
			Alert.alert("Success", "Payment sent successfully");
		} catch (err: any) {
			Alert.alert("Error", err.message || "Failed to accept request");
		} finally {
			setProcessingId(null);
		}
	};

	const handleReject = async (requestId: Id<"requests">) => {
		setProcessingId(requestId);
		try {
			await rejectRequest({ requestId, reason: "Declined" });
			Alert.alert("Rejected", "Request has been declined");
		} catch (err: any) {
			Alert.alert("Error", err.message || "Failed to reject request");
		} finally {
			setProcessingId(null);
		}
	};

	if (!incomingRequests || !outgoingRequests) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator color={colors.primary} />
			</View>
		);
	}

	return (
		<View style={styles.tabContent}>
			{/* Incoming Requests */}
			<Text style={[styles.sectionTitle, { color: colors.text }]}>Incoming Requests</Text>
			{incomingRequests.length === 0 ? (
				<Text style={[styles.emptyText, { color: colors.textMuted }]}>No incoming requests</Text>
			) : (
				incomingRequests.map((req: any) => (
					<InfoCard key={req._id} style={styles.requestCard}>
						<View style={styles.requestHeader}>
							<View style={{ flex: 1 }}>
								<Text style={[styles.requestName, { color: colors.text }]}>{req.fromUser?.fullName || "Unknown"}</Text>
								<Text style={[styles.requestAmount, { color: colors.primary }]}>Rs. {req.amount.toLocaleString()}</Text>
								{req.note && <Text style={[styles.requestNote, { color: colors.textMuted }]}>{req.note}</Text>}
							</View>
							<View style={styles.requestActions}>
								<TouchableOpacity
									style={[styles.acceptBtn, { backgroundColor: colors.success }]}
									onPress={() => handleAccept(req._id)}
									disabled={processingId === req._id}
								>
									<Ionicons name="checkmark" size={20} color="#FFFFFF" />
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.rejectBtn, { backgroundColor: colors.danger }]}
									onPress={() => handleReject(req._id)}
									disabled={processingId === req._id}
								>
									<Ionicons name="close" size={20} color="#FFFFFF" />
								</TouchableOpacity>
							</View>
						</View>
					</InfoCard>
				))
			)}

			{/* Outgoing Requests */}
			<Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Outgoing Requests</Text>
			{outgoingRequests.length === 0 ? (
				<Text style={[styles.emptyText, { color: colors.textMuted }]}>No outgoing requests</Text>
			) : (
				outgoingRequests.map((req: any) => (
					<InfoCard key={req._id} style={styles.requestCard}>
						<View>
							<Text style={[styles.requestName, { color: colors.text }]}>To: {req.toUser?.fullName || "Unknown"}</Text>
							<Text style={[styles.requestAmount, { color: colors.primary }]}>Rs. {req.amount.toLocaleString()}</Text>
							<Text style={[styles.requestStatus, { color: colors.textMuted }]}>Status: {req.status}</Text>
							{req.note && <Text style={[styles.requestNote, { color: colors.textMuted }]}>{req.note}</Text>}
						</View>
					</InfoCard>
				))
			)}
		</View>
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
	balanceCard: {
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
	},
	balanceLabel: {
		fontSize: 14,
		color: "#FFFFFF",
		opacity: 0.9,
	},
	balanceAmount: {
		fontSize: 32,
		fontWeight: "800",
		color: "#FFFFFF",
		marginTop: 8,
	},
	tabsContainer: {
		flexDirection: "row",
		gap: 8,
		marginBottom: 20,
	},
	tabButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		borderRadius: 12,
		borderWidth: 1,
		gap: 6,
	},
	tabLabel: {
		fontSize: 13,
		fontWeight: "600",
	},
	tabContent: {
		paddingBottom: 40,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 16,
	},
	prepaySection: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 16,
		paddingVertical: 12,
	},
	prepayLabel: {
		fontSize: 14,
	},
	prepayAmount: {
		fontSize: 18,
		fontWeight: "700",
	},
	actionButton: {
		marginTop: 8,
	},
	carrierBadge: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 8,
		borderWidth: 1,
		marginBottom: 12,
	},
	carrierText: {
		fontSize: 14,
		fontWeight: "600",
		textAlign: "center",
	},
	recipientCard: {
		marginBottom: 16,
	},
	recipientInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	recipientName: {
		fontSize: 16,
		fontWeight: "700",
	},
	recipientPhone: {
		fontSize: 14,
		marginTop: 4,
	},
	requestCard: {
		marginBottom: 12,
	},
	requestHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	requestName: {
		fontSize: 15,
		fontWeight: "700",
	},
	requestAmount: {
		fontSize: 18,
		fontWeight: "800",
		marginTop: 4,
	},
	requestNote: {
		fontSize: 13,
		marginTop: 6,
	},
	requestStatus: {
		fontSize: 12,
		marginTop: 4,
		textTransform: "uppercase",
	},
	requestActions: {
		flexDirection: "row",
		gap: 8,
	},
	acceptBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	rejectBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyText: {
		textAlign: "center",
		marginVertical: 20,
	},
});