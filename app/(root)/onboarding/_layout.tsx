// app/(root)/onboarding/_layout.tsx
import { Stack } from "expo-router";

export default function OnboardingLayout() {
        return (
                <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="onboardingSlider" />
                        <Stack.Screen name="signup" />
                        <Stack.Screen name="login" />
                </Stack>
        );
}
