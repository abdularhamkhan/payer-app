
import { createHomeStyles } from '@/assets/styles/home.styles'
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
                <Text>Home</Text>
                <TouchableOpacity onPress={toggleDarkMode}>
                    <Text>
                        Hey
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default Home