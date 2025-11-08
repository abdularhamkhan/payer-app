
import { createHomeStyles } from '@/assets/styles/home.styles'
import BalanceCard from '@/components/tabs/home/BalanceCard'
import Header from '@/components/tabs/home/Header'
import QuickActions from '@/components/tabs/home/QuickActions'
import TransactionHistory from '@/components/tabs/home/TransactionHistory'
import useTheme from '@/hooks/useTheme'
import { LinearGradient } from "expo-linear-gradient"
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'


const Home = () => {
    const { colors } = useTheme();
    const homeStyles = createHomeStyles(colors);
    return (
        <LinearGradient colors={colors.gradients.background} style={homeStyles.container}>
            <SafeAreaView>
                <Header />
                <BalanceCard />
                <QuickActions />
                <TransactionHistory />
            </SafeAreaView>
        </LinearGradient>
    )
}

export default Home