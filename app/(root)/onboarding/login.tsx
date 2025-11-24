// app/(root)/onboarding/login.tsx
import { onboardingStyles as styles } from "@/styles/onboardingStyles";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
        const router = useRouter();
        const { signIn, setActive, isLoaded } = useSignIn();

        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");

        const handleLogin = async () => {
                if (!isLoaded) return;

                try {
                        const result = await signIn.create({
                                identifier: email,
                                password,
                        });

                        await setActive({ session: result.createdSessionId });
                        router.replace("/(protected)/home");
                } catch (err) {
                        console.log("Login error:", err);
                }
        };

        return (
                <View style={styles.container}>
                        <Text style={styles.subtitle}>Happy to see you again.</Text>

                        <TextInput
                                placeholder="Email"
                                style={styles.inputBox}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                        />

                        <TextInput
                                placeholder="Password"
                                secureTextEntry
                                style={styles.inputBox}
                                value={password}
                                onChangeText={setPassword}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                                <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                </View>
        );
}

// const styles = {
//         container: { flex: 1, padding: 16 },
//         subtitle: { fontSize: 18, marginBottom: 12 },
//         inputBox: { height: 48, borderWidth: 1, borderRadius: 8, marginBottom: 12, paddingHorizontal: 12 },
//         button: { height: 48, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: "#7F5AF0" },
//         buttonText: { color: "white", fontWeight: "700" },
// };
