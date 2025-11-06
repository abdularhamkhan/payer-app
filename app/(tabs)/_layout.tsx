import useTheme from "@/hooks/useTheme"
import { Ionicons } from "@expo/vector-icons"
import { Tabs } from 'expo-router'
import React from 'react'

const TabsLayout = () => {
    const { isDarkMode, colors } = useTheme();
    return (
        <Tabs screenOptions={{
            tabBarStyle: {
                backgroundColor: colors.surface,
                borderTopWidth: 1,
                borderTopColor: colors.border,
                height: 90,
                paddingBottom: 30,
                paddingTop: 10
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: 600,
                textAlign: "center",
                alignContent: "center"
            },
            tabBarInactiveTintColor: isDarkMode ? "white" : "black",
            headerShown: false

        }}>

            <Tabs.Screen name='index' options={{
                title: 'Home',
                tabBarIcon: ({ color, size, focused }) => <Ionicons name='home-outline' size={size} color={focused ? colors.primary : color} />,
                tabBarActiveTintColor: colors.primary
            }} />
            <Tabs.Screen name='cardsWallet' options={{
                title: 'Wallet',
                tabBarIcon: ({ color, size, focused }) => <Ionicons name='wallet-outline' size={size} color={focused ? colors.primary : color} />,
                tabBarActiveTintColor: colors.primary
            }} />
            <Tabs.Screen name='scanQrCode' options={{
                title: 'Scan',
                tabBarIcon: ({ color, size, focused }) => <Ionicons name='qr-code-outline' size={size} color={focused ? colors.primary : color} />,
                tabBarActiveTintColor: colors.primary

            }} />
            <Tabs.Screen name='statsAnalytics' options={{
                title: 'Stats',
                tabBarIcon: ({ color, size, focused }) => <Ionicons name='trending-up-outline' size={size} color={focused ? colors.primary : color} />,
                tabBarActiveTintColor: colors.primary

            }} />
            <Tabs.Screen name='userProfile' options={{
                title: 'You',
                tabBarIcon: ({ color, size, focused }) => <Ionicons name='person-circle-outline' size={size} color={focused ? colors.primary : color} />,
                tabBarActiveTintColor: colors.primary

            }} />

        </Tabs>
    )
}

export default TabsLayout