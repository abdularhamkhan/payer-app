import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function QRGenerateScreen() {
        const { colors } = useTheme();
        const router = useRouter();
        const [amount, setAmount] = useState("");
        const [isPublic, setIsPublic] = useState(false);


        const handleCreate = async () => {
                // TODO: call convex mutation to generate QR token
                if (!amount && !isPublic) {
                        Alert.alert("Enter amount or toggle open QR");
                        return;
                }


                // Placeholder create flow
                const fakeToken = Math.random().toString(36).slice(2, 10);
                router.replace(`/(protected)/qr/preview?token=${fakeToken}&amount=${amount || ""}` as any);
        };


        return (
                <Screen>
                        <View style={styles.wrap}>
                                <Text style={[styles.title, { color: colors.text }]}>Generate QR</Text>


                                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                                        <Text style={[styles.label, { color: colors.textMuted }]}>Amount (optional)</Text>
                                        <TextInput
                                                placeholder="Rs. 0.00"
                                                keyboardType="numeric"
                                                value={amount}
                                                onChangeText={setAmount}
                                                style={[styles.input, { backgroundColor: colors.backgrounds.input, color: colors.text }]}
                                        />


                                        <View style={styles.rowBetween}>
                                                <TouchableOpacity onPress={() => setIsPublic(!isPublic)} style={styles.toggleBtn}>
                                                        <Ionicons name={isPublic ? "lock-open-outline" : "lock-closed-outline"} size={18} color={colors.primary} />
                                                        <Text style={{ marginLeft: 8, color: colors.text }}>{isPublic ? "Open QR" : "Private QR"}</Text>
                                                </TouchableOpacity>


                                                <TouchableOpacity style={[styles.createBtn, { backgroundColor: colors.primary }]} onPress={handleCreate}>
                                                        <Text style={{ color: "white", fontWeight: "700" }}>Create</Text>
                                                </TouchableOpacity>
                                        </View>
                                </View>


                                <TouchableOpacity style={styles.link} onPress={() => router.push("/(protected)/qr/history" as any)}>
                                        <Text style={{ color: colors.textMuted }}>View QR history</Text>
                                </TouchableOpacity>
                        </View>
                </Screen>
        );
}


const styles = StyleSheet.create({
        wrap: { padding: 16 },
        title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
        card: { padding: 16, borderRadius: 12 },
        label: { fontSize: 13, marginBottom: 6 },
        input: { height: 48, borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 },
        rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
        toggleBtn: { flexDirection: "row", alignItems: "center" },
        createBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
        link: { marginTop: 14, alignItems: "center" }
})