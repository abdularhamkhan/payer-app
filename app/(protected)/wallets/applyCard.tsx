import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function ApplyCardScreen() {
        const { colors } = useTheme();
        const router = useRouter();
        const [firstName, setFirstName] = useState("");
        const [lastName, setLastName] = useState("");
        const [address, setAddress] = useState("");


        const handleApply = () => {
                if (!firstName || !lastName || !address) {
                        Alert.alert("Please fill all fields");
                        return;
                }
                // TODO: submit to backend
                Alert.alert("Applied", "We received your card application");
                router.replace("/(protected)/wallets" as any);
        };


        return (
                <Screen>
                        <View style={{ padding: 16 }}>
                                <Text style={[styles.title, { color: colors.text }]}>Apply for Debit/Credit Card</Text>


                                <TextInput placeholder="First name" style={[styles.input, { backgroundColor: colors.backgrounds.input, color: colors.text }]} value={firstName} onChangeText={setFirstName} />
                                <TextInput placeholder="Last name" style={[styles.input, { backgroundColor: colors.backgrounds.input, color: colors.text }]} value={lastName} onChangeText={setLastName} />
                                <TextInput placeholder="Address" style={[styles.input, { backgroundColor: colors.backgrounds.input, color: colors.text }]} value={address} onChangeText={setAddress} />


                                <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={handleApply}>
                                        <Text style={{ color: "white", fontWeight: "700" }}>Apply</Text>
                                </TouchableOpacity>
                        </View>
                </Screen>
        );
}


const styles = StyleSheet.create({
        title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
        input: { height: 48, borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 },
        btn: { padding: 14, borderRadius: 10, alignItems: "center", marginTop: 8 },
});