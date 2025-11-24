import { StyleSheet } from "react-native";

export const onboardingStyles = StyleSheet.create({
        container: { flex: 1, padding: 16 },
        subtitle: { fontSize: 18, marginBottom: 12 },
        inputBox: {
                height: 48,
                borderWidth: 1,
                borderRadius: 8,
                marginBottom: 12,
                paddingHorizontal: 12,
                borderColor: "#ccc",
        },
        button: {
                height: 48,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#7F5AF0",
        },
        buttonText: {
                color: "white",
                fontWeight: "700",
        },
});
