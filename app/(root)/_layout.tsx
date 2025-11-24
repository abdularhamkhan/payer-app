// app/(root)/_layout.tsx
import { ThemeProvider } from "@/hooks/useTheme";
import { tokenCache } from "@/lib/clerkTokenCache";
import { ClerkProvider } from "@clerk/clerk-expo";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import * as Linking from "expo-linking";
import { Slot } from "expo-router";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL!;
const convex = new ConvexReactClient(convexUrl);

export default function RootLayout() {
        const urlScheme = Linking.createURL("/");

        return (
                <ClerkProvider
                        publishableKey={publishableKey}
                        tokenCache={tokenCache}
                        redirectUrl={urlScheme}
                >
                        <ConvexProvider client={convex}>
                                <ThemeProvider>
                                        <Slot />
                                </ThemeProvider>
                        </ConvexProvider>
                </ClerkProvider>
        );
}
