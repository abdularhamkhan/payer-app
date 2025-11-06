import { createHomeStyles } from '@/assets/styles/home.styles'
import useTheme from '@/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'

const QuickActions = () => {
    const { colors } = useTheme();
    const homeStyles = createHomeStyles(colors);
    return (
        <View style={homeStyles.actionsRow}>
            <View style={homeStyles.actionButton}>
                <Ionicons name='add' size={20} color={colors.textMuted} style={homeStyles.actionIconContainer}/>
                <Text style={homeStyles.actionLabel}>Top-up</Text>
            </View>
            <View style={homeStyles.actionButton}>
                <Ionicons name='arrow-redo-outline' size={20} color={colors.textMuted} style={homeStyles.actionIconContainer}/>
                <Text style={homeStyles.actionLabel}>Transfer</Text>
            </View>
            <View style={homeStyles.actionButton}>
                <Ionicons name='arrow-undo-outline' size={20} color={colors.textMuted} style={homeStyles.actionIconContainer}/>
                <Text style={homeStyles.actionLabel}>Request</Text>
            </View>
            <View style={homeStyles.actionButton}>
                <Ionicons name='apps-outline' size={20} color={colors.textMuted} style={homeStyles.actionIconContainer}/>
                <Text style={homeStyles.actionLabel}>More</Text>
            </View>
        </View>
    )
}

export default QuickActions

