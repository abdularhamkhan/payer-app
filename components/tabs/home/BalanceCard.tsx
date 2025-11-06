import { createHomeStyles } from '@/assets/styles/home.styles';
import useTheme from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const BalanceCard = () => {
    const { colors, isDarkMode } = useTheme();
    const homeStyles = createHomeStyles(colors);
    const accountBalance = "45000"
    const [hideBalance, setHideBalance] = useState(false);
    const hideAmount = () => {
        setHideBalance(!hideBalance)
    }
    return (
        <LinearGradient
            colors={colors.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={homeStyles.balanceCard}
        >
            <View>
                <View style={homeStyles.balanceText}>
                    <View><Text style={homeStyles.balanceLabel}>Your Balance</Text></View>
                    <View style={homeStyles.hideArea}>
                        <TouchableOpacity onPress={hideAmount}>
                            <Ionicons name={hideBalance ? 'eye-off-outline' : 'eye-outline'} size={20} color={isDarkMode ? colors.text : "black"} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={homeStyles.balanceValue}>Rs. {hideBalance && accountBalance}</Text>

            </View>
        </LinearGradient>
    )
}

export default BalanceCard