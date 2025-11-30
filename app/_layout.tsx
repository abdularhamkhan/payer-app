// app/_layout.tsx
import { ThemeProvider } from "@/hooks/useTheme";
import { tokenCache } from "@/lib/clerkTokenCache";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Slot } from "expo-router";
import React, { useEffect } from "react";
import Toast from "react-native-toast-message";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL!;
const convex = new ConvexReactClient(convexUrl);

function ConvexClerkProvider({ children }: { children: React.ReactNode }) {
	const { getToken, isSignedIn } = useAuth();

	useEffect(() => {
		if (isSignedIn) {
			convex.setAuth(async () => {
				const token = await getToken({ template: "convex" });
				return token ?? undefined;
			});
		} else {
			convex.clearAuth();
		}
	}, [getToken, isSignedIn]);

	return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

export default function RootLayout() {
	return (
		<ClerkProvider
			publishableKey={publishableKey}
			tokenCache={tokenCache}
		>
			<ConvexClerkProvider>
				<ThemeProvider>
					<Slot />
					<Toast />
				</ThemeProvider>
			</ConvexClerkProvider>
		</ClerkProvider>
	);
}
