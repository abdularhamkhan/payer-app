import useTheme, { ColorScheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
interface CardInterface {
        text: string;
        number: number;
        eye?: false;
}

const Card = ({ cardInput }: { cardInput: CardInterface }) => {
        const { colors } = useTheme();
        const styles = styleFunction(colors);
        const [hidden, setIsHidden] = useState<boolean>(!!cardInput.eye)

        return (
                <View style={styles.container}>
                        <LinearGradient
                                colors={colors.gradients.primary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 0 }}
                        >
                                <View style={styles.textAndEyeContainer}>
                                        <Text>{cardInput.text}</Text>
                                        {
                                                cardInput.eye ? <Ionicons
                                                        name={hidden ? 'eye-off-outline' : 'eye-outline'}
                                                        size={18}
                                                        color={colors.text}
                                                        style={styles.eye}
                                                /> : null
                                        }

                                </View>
                                <View>
                                        <Text style={styles.number}>
                                                {cardInput.number}
                                        </Text>
                                </View>
                        </LinearGradient>
                </View>
        )
}

export default Card

const styleFunction = (colors: ColorScheme) => {
        const styles = StyleSheet.create({
                container: {
                        margin: 10,
                        padding: 10,
                        borderRadius: 8,
                        justifyContent: "space-between",
                        overflow: "hidden"
                },
                text: {
                        fontSize: 14,
                        color: colors.text,
                        margin: 5,
                },
                number: {
                        fontWeight: "800",
                        fontSize: 20,
                        margin: 10,
                        color: colors.text
                },
                eye: {
                        margin: 5
                },
                textAndEyeContainer: {
                        flexDirection: "row",
                        gap: 5,
                        alignItems: "center"
                }
        })
        return styles
}