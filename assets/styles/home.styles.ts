import useTheme, { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createHomeStyles = (colors: ColorScheme) => {
    const { isDarkMode } = useTheme();
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.bg,
            paddingHorizontal: 20,
            paddingTop: 40,
            
        },

        // Header
        headerContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            paddingHorizontal:10,
            paddingVertical:10,
            borderWidth: 1,
            borderRadius: 12,
            borderColor: isDarkMode? colors.textMuted: "black"
        },
        profileSection: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },
        avatar: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.surface,
        },
        headerText: {
            color: colors.textMuted,
            fontSize: 16,
        },
        headerName: {
            color: colors.text,
            fontWeight: "700",
            fontSize: 18,
        },
        notificationButton: {
            width: 40,
            height: 40,
            borderRadius: 25,
            borderWidth: 1.5,
            borderColor: isDarkMode ? colors.textMuted : "black",
            justifyContent: "center",
            alignItems: "center",
        },

        // Balance Card
        balanceCard: {
            borderRadius: 20,
            padding: 20,
            marginBottom: 24,
            overflow: "hidden",
            shadowColor: colors.shadow,
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 6 },
            shadowRadius: 10,
        },
        balanceLabel: {
            color: colors.textMuted,
            fontSize: 16,
            marginBottom: 8,
            fontWeight: "500",
        },
        balanceValue: {
            color: colors.text,
            fontSize: 36,
            fontWeight: "800",
            letterSpacing: 1,
        },

        // Quick Actions
        actionsRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 28,
        },
        actionButton: {
            alignItems: "center",
            justifyContent: "center",
            width: 70,
        },
        actionIconContainer: {
            width: 56,
            height: 56,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.surface,
            marginBottom: 8,
        },
        actionLabel: {
            color: colors.textMuted,
            fontSize: 14,
            fontWeight: "600",
            textAlign: "center",
        },

        // Recent Transactions
        transactionsSection: {
            marginTop: 10,
        },
        sectionHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
        },
        sectionTitle: {
            color: colors.text,
            fontSize: 18,
            fontWeight: "700",
        },
        seeAll: {
            color: colors.primary,
            fontSize: 14,
            fontWeight: "600",
        },

        transactionItem: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "transparent",
            marginBottom: 16,
        },
        transactionLeft: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        },
        transactionIcon: {
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: "center",
            alignItems: "center",
        },
        transactionDetails: {
            justifyContent: "center",
        },
        transactionTitle: {
            color: colors.text,
            fontSize: 16,
            fontWeight: "600",
        },
        transactionDate: {
            color: colors.textMuted,
            fontSize: 13,
            marginTop: 2,
        },
        transactionAmount: {
            fontSize: 16,
            fontWeight: "700",
        },
        transactionPositive: {
            color: colors.success,
        },
        transactionNegative: {
            color: colors.danger,
        },
    });

    return styles;
};
