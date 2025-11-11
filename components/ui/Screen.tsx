import useTheme from '@/hooks/useTheme';
import { LinearGradient } from "expo-linear-gradient";
import React from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
    children: React.ReactNode;
    scrollable?: boolean;
    gradient?: boolean;
    style?: ViewStyle;
    contentContainerStyle?: ViewStyle;
    safeArea?: boolean;
}

const Screen: React.FC<ScreenProps> = (
    {
        children,
        scrollable = false,
        gradient = false,
        style = {},
        contentContainerStyle = {},
        safeArea = true
    }
) => {
    const { colors } = useTheme();
    const Container = safeArea ? SafeAreaView : View;
    const Wrapper = scrollable ? ScrollView : View;
    return (
        <Container style={[{ flex: 1 }, style]}
            {...(safeArea ? { edges: ["top"] } : {})}>
            {
                gradient ? (
                    <LinearGradient
                        colors={colors.gradients.background}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ flex: 1 }}
                    >
                        <Wrapper
                            contentContainerStyle={[
                                { flexGrow: 1 },
                                contentContainerStyle,
                            ]}
                            showsVerticalScrollIndicator={false}
                        >
                            {children}
                        </Wrapper>
                    </LinearGradient>
                ) : (
                    <Wrapper
                        contentContainerStyle={[
                            { flexGrow: 1, backgroundColor: colors.bg },
                            contentContainerStyle,
                        ]}
                        showsVerticalScrollIndicator={false}
                    >
                        {children}
                    </Wrapper>
                )

            }
        </Container>
    )
}

export default Screen