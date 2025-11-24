// app/(root)/index.tsx
import { useAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Splash() {
        const router = useRouter();
        const { isSignedIn, isLoaded } = useAuth();

        useEffect(() => {
                (async () => {
                        // Wait for Clerk to initialize
                        if (!isLoaded) return;

                        const seen = await AsyncStorage.getItem("seen_onboarding");

                        if (!seen) {
                                // first time -> onboarding slider
                                router.replace("/onboarding/onboardingSlider");
                                return;
                        }

                        // If user signed into Clerk -> protected area, else login
                        if (isSignedIn) {
                                router.replace("/(protected)/home");
                        } else {
                                router.replace("/onboarding/login");
                        }
                })();
        }, [isLoaded, isSignedIn]);

        return (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="large" />
                </View>
        );
}
