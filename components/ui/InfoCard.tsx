import useTheme from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

interface InfoCardProps {
    children: React.ReactNode;
    gradient?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
    elevated?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({
    children,
    gradient = false,
    onPress,
    style = {},
    elevated = false,
}) => {
    const { colors } = useTheme();

    const cardStyle = [
        styles.card,
        {
            backgroundColor: colors.surface,
            borderColor: colors.border,
        },
        elevated && {
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
        },
        style,
    ];

    if (gradient) {
        const Wrapper = onPress ? TouchableOpacity : View;
        return (
            <Wrapper onPress={onPress} activeOpacity={0.8} style={[styles.card, style]}>
                <LinearGradient
                    colors={colors.gradients.surface}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientCard}
                >
                    {children}
                </LinearGradient>
            </Wrapper>
        );
    }

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={cardStyle}>
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
    },
    gradientCard: {
        borderRadius: 16,
        padding: 16,
    },
});

export default InfoCard;
