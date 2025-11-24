import useTheme from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    gradient?: boolean;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    onPress,
    title,
    variant = 'primary',
    gradient = false,
    loading = false,
    disabled = false,
    style = {},
    fullWidth = false,
}) => {
    const { colors } = useTheme();

    const getBackgroundColor = () => {
        switch (variant) {
            case 'primary':
                return colors.primary;
            case 'secondary':
                return colors.surface;
            case 'danger':
                return colors.danger;
            case 'outline':
                return 'transparent';
            default:
                return colors.primary;
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'primary':
            case 'danger':
                return '#FFFFFF';
            case 'secondary':
                return colors.text;
            case 'outline':
                return colors.primary;
            default:
                return '#FFFFFF';
        }
    };

    const buttonStyle = [
        styles.button,
        {
            backgroundColor: getBackgroundColor(),
            borderColor: variant === 'outline' ? colors.primary : 'transparent',
            borderWidth: variant === 'outline' ? 2 : 0,
            opacity: disabled ? 0.5 : 1,
        },
        fullWidth && { width: '100%' },
        style,
    ];

    if (gradient && variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.8}
                style={[styles.button, fullWidth && { width: '100%' }, style]}
            >
                <LinearGradient
                    colors={colors.gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>{title}</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={buttonStyle}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.buttonText, { color: getTextColor() }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 52,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    gradient: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
    },
});

export default Button;
