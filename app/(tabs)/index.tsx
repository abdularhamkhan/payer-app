
import { createHomeStyles } from '@/assets/styles/home.styles'
import BalanceCard from '@/components/tabs/home/BalanceCard'
import Header from '@/components/tabs/home/Header'
import TransactionHistory from '@/components/tabs/home/TransactionHistory'
import useTheme from '@/hooks/useTheme'
import { LinearGradient } from "expo-linear-gradient"
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


const Home = () => {
    const { toggleDarkMode, colors } = useTheme();
    const homeStyles = createHomeStyles(colors);
    return (
        <LinearGradient colors={colors.gradients.background} style={homeStyles.container}>
            <SafeAreaView>
                <Header/>
                <BalanceCard/>
                <TouchableOpacity onPress={toggleDarkMode}>
                <Text>
                    Change
                </Text>
            </TouchableOpacity>
                <TransactionHistory/>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default Home