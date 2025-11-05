import { Ionicons } from "@expo/vector-icons"
import { Tabs } from 'expo-router'
import React from 'react'

const TabsLayout = () => {
    return (
        <Tabs screenOptions={{
            tabBarStyle:{},
            tabBarLabelStyle:{},
            tabBarInactiveTintColor:"",
            headerShown:false

        }}>

            <Tabs.Screen name='index' options={{
                title: 'Home',
                tabBarIcon: ({ color, size, focused }) => <Ionicons name='home-outline' size={size} color={focused ? "" : color} />,
                tabBarActiveTintColor: "skyblue"
            }} />
            <Tabs.Screen name='cardsWallet' options={{
                title: 'Wallet',
                tabBarIcon: ({ color, size, focused }) => <Ionicons name='wallet-outline' size={size} color={focused ? "" : color} />,
                tabBarActiveTintColor: "skyblue"
            }} />
            <Tabs.Screen name='scanQrCode' options={{
                title: 'Scan',
                tabBarIcon: ({ color, size, focused }) => <Ionicons name='qr-code-outline' size={size} color={focused ? "" : color} />,
                tabBarActiveTintColor: "skyblue"

            }} />
            <Tabs.Screen name='stocksAnalytics' options={{
                title: 'Stocks',
                tabBarIcon: ({ color, size, focused }) => <Ionicons name='analytics-outline' size={size} color={focused ? "" : color} />,
                tabBarActiveTintColor: "skyblue"

            }} />
            <Tabs.Screen name='userProfile' options={{
                title: 'You',
                tabBarIcon: ({ color, size, focused }) => <Ionicons name='person-circle-outline' size={size} color={focused ? "" : color} />,
                tabBarActiveTintColor: "skyblue"

            }} />

        </Tabs>
    )
}

export default TabsLayout