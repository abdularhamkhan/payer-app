// app/(root)/onboarding/onboardingSlider.tsx
import useTheme from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
        Dimensions,
        NativeScrollEvent,
        NativeSyntheticEvent,
        ScrollView,
        StyleSheet,
        Text,
        TouchableOpacity,
        View,
} from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");

const slides = [
        {
                key: "welcome",
                title: "Welcome To",
                logoText: "Payer",
                cta: "Sign Up",
                to: "/onboarding/signup",
        },
        {
                key: "promo",
                title: "No.1 E-wallet in Pakistan",
                cta: "Sign Up",
                to: "/onboarding/signup",
        },
] as const;

export default function OnboardingSlider() {
        const { colors } = useTheme();
        const router = useRouter();
        const scrollRef = useRef<ScrollView | null>(null);
        const [index, setIndex] = useState(0);

        const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
                const x = e.nativeEvent.contentOffset.x;
                const newIndex = Math.round(x / SCREEN_W);
                setIndex(newIndex);
        };

        const finish = async (to: string) => {
                await AsyncStorage.setItem("seen_onboarding", "1");
                router.replace(to as any);
        };

        return (
                <View style={[styles.container, { backgroundColor: colors.bg }]}>
                        <ScrollView
                                ref={scrollRef}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onScroll={onScroll}
                                scrollEventThrottle={16}
                        >
                                {slides.map((s) => (
                                        <View key={s.key} style={[styles.slide, { width: SCREEN_W }]}>
                                                <Text style={[styles.title, { color: colors.text }]}>{s.title}</Text>
                                                <View style={[styles.logo, { borderColor: colors.primary }]}>
                                                        <Text style={[styles.logoText, { color: colors.primary }]}>
                                                                Payer
                                                        </Text>
                                                </View>
                                                <Text style={[styles.swipe, { color: colors.textMuted }]}>
                                                        Swipe …
                                                </Text>

                                                <TouchableOpacity
                                                        onPress={() => finish(s.to)}
                                                        style={[styles.cta, { backgroundColor: colors.primary }]}
                                                >
                                                        <Text style={styles.ctaText}>{s.cta}</Text>
                                                </TouchableOpacity>
                                        </View>
                                ))}
                        </ScrollView>

                        <View style={styles.dotsWrap}>
                                {slides.map((_, i) => (
                                        <View
                                                key={i}
                                                style={[
                                                        styles.dot,
                                                        { backgroundColor: i === index ? colors.primary : colors.textMuted },
                                                ]}
                                        />
                                ))}
                        </View>
                </View>
        );
}

const styles = StyleSheet.create({
        container: { flex: 1 },
        slide: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
        title: { fontSize: 22, marginBottom: 20, fontWeight: "700" },
        logo: {
                width: 160,
                height: 160,
                borderRadius: 80,
                borderWidth: 6,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 30,
        },
        logoText: { fontSize: 28, fontWeight: "800" },
        swipe: { marginTop: 12, marginBottom: 24 },
        cta: { paddingHorizontal: 40, paddingVertical: 12, borderRadius: 12 },
        ctaText: { color: "white", fontWeight: "700", fontSize: 16 },
        dotsWrap: { position: "absolute", bottom: 36, left: 0, right: 0, flexDirection: "row", justifyContent: "center" },
        dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 6 },
});
