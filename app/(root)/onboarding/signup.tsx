import { api } from "@/convex/_generated/api";
import { onboardingStyles as styles } from "@/styles/onboardingStyles";
import { useSignUp } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignupScreen() {
        const router = useRouter();
        const { signUp, setActive, isLoaded } = useSignUp();

        const createUser = useMutation(api.users.create.create)

        const [email, setEmail] = useState("");
        const [phone, setPhone] = useState("");
        const [password, setPassword] = useState("");
        const [code, setCode] = useState("");
        const [stage, setStage] = useState<"signup" | "verify">("signup");

        const handleSignup = async () => {
                if (!isLoaded || !signUp) return;

                try {
                        await signUp.create({
                                emailAddress: email,
                                password,
                        });

                        await signUp.prepareEmailAddressVerification({
                                strategy: "email_code",
                        });

                        setStage("verify");
                } catch (err) {
                        console.error(err);
                }
        };
        const handleVerify = async () => {
                if (!signUp) return;

                try {
                        const result = await signUp.attemptEmailAddressVerification({ code });

                        await setActive({ session: result.createdSessionId });

                        const clerkUserId = result.createdUserId!;  // ✅ Correct for Expo

                        await createUser({
                                clerkUserId,
                                phone,
                                fullName: "New User",
                                email,
                        });

                        router.replace("/(protected)/home");
                } catch (err) {
                        console.error("Verification error:", err);
                }
        };


        return (
                <View style={styles.container}>
                        {stage === "signup" && (
                                <>
                                        <Text style={styles.subtitle}>One Last Step for Financial Freedom</Text>

                                        <TextInput
                                                placeholder="Email"
                                                style={styles.inputBox}
                                                value={email}
                                                onChangeText={setEmail}
                                        />
                                        <TextInput
                                                placeholder="Phone"
                                                style={styles.inputBox}
                                                value={phone}
                                                onChangeText={setPhone}
                                        />
                                        <TextInput
                                                placeholder="Password"
                                                secureTextEntry
                                                style={styles.inputBox}
                                                value={password}
                                                onChangeText={setPassword}
                                        />

                                        <TouchableOpacity style={styles.button} onPress={handleSignup}>
                                                <Text style={styles.buttonText}>Sign Up</Text>
                                        </TouchableOpacity>
                                </>
                        )}

                        {stage === "verify" && (
                                <>
                                        <Text style={styles.subtitle}>Enter Verification Code</Text>

                                        <TextInput
                                                placeholder="6-digit code"
                                                style={styles.inputBox}
                                                keyboardType="numeric"
                                                value={code}
                                                onChangeText={setCode}
                                        />

                                        <TouchableOpacity style={styles.button} onPress={handleVerify}>
                                                <Text style={styles.buttonText}>Verify</Text>
                                        </TouchableOpacity>
                                </>
                        )}
                </View>
        );
}
