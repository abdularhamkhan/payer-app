import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const sample = [
        { id: "q1", token: "a1b2c3d4", amount: 250, createdAt: "2025-10-25" },
        { id: "q2", token: "z9y8x7w6", amount: null, createdAt: "2025-10-21" },
];


export default function QRHistoryScreen() {
        const { colors } = useTheme();
        const router = useRouter();


        return (
                <Screen>
                        <View style={{ padding: 16 }}>
                                <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>QR Codes</Text>


                                <FlatList
                                        data={sample}
                                        keyExtractor={(r) => r.id}
                                        style={{ marginTop: 12 }}
                                        renderItem={({ item }) => (
                                                <TouchableOpacity
                                                        style={[styles.row, { backgroundColor: colors.surface }]}
                                                        onPress={() => router.push(`/(protected)/qr/preview?token=${item.token}` as any)}
                                                >
                                                        <View style={{ flex: 1 }}>
                                                                <Text style={{ color: colors.text, fontWeight: "700" }}>{item.token}</Text>
                                                                <Text style={{ color: colors.textMuted }}>{item.amount ? `Rs. ${item.amount}` : "Open / Any amount"}</Text>
                                                        </View>
                                                        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                                                </TouchableOpacity>
                                        )}
                                />
                        </View>
                </Screen>
        );
}


const styles = StyleSheet.create({
        row: { padding: 12, borderRadius: 12, flexDirection: "row", alignItems: "center", marginBottom: 12 },
});