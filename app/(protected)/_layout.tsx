// app/(protected)/_layout.tsx
import useTheme from "@/hooks/useTheme";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";

const TabsLayout = () => {
    const { isDarkMode, colors } = useTheme();
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    // protect: if Clerk not signed in, redirect to onboarding login
    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) router.replace("/onboarding/login");
    }, [isLoaded, isSignedIn]);

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    height: 90,
                    paddingBottom: 30,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600" as any,
                    textAlign: "center",
                },
                tabBarInactiveTintColor: isDarkMode ? "white" : "black",
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="home/index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name="home-outline" size={size} color={focused ? colors.primary : color} />
                    ),
                    tabBarActiveTintColor: colors.primary,
                }}
            />
            <Tabs.Screen
                name="wallets/index"
                options={{
                    title: "Wallet",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name="wallet-outline" size={size} color={focused ? colors.primary : color} />
                    ),
                    tabBarActiveTintColor: colors.primary,
                }}
            />
            <Tabs.Screen
                name="qr/index"
                options={{
                    title: "Scan",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name="qr-code-outline" size={size} color={focused ? colors.primary : color} />
                    ),
                    tabBarActiveTintColor: colors.primary,
                }}
            />
            <Tabs.Screen
                name="stats/index"
                options={{
                    title: "Stats",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name="trending-up-outline" size={size} color={focused ? colors.primary : color} />
                    ),
                    tabBarActiveTintColor: colors.primary,
                }}
            />
            <Tabs.Screen
                name="profile/index"
                options={{
                    title: "You",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name="person-circle-outline" size={size} color={focused ? colors.primary : color} />
                    ),
                    tabBarActiveTintColor: colors.primary,
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
