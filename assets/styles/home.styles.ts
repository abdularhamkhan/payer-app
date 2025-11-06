import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createHomeStyles = (colors: ColorScheme) => {
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
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderWidth: 1,
            borderRadius: 12,
            borderColor: colors.text,
            backgroundColor: colors.gradients.background[0]
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
            color: colors.text,
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
            borderColor: colors.text,
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
        balanceText: {
            flexDirection: "row",
            gap: 20,
            textAlign: "center"
        },
        balanceLabel: {
            color: colors.text,
            fontSize: 16,
            fontWeight: "500",
        },
        balanceValue: {
            color: colors.text,
            fontSize: 36,
            fontWeight: "800",
            letterSpacing: 1,
        },
        hideArea: {
            width: 40,
            height: 40
        },

        // Quick Actions
        actionsRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 28,
            paddingHorizontal: 20
        },
        actionButton: {
            alignItems: "center",
            justifyContent: "center",
            width: 70,
        },
        actionText: {
            color: colors.text,
            fontSize: 12
        },
        actionIconContainer: {
            width: 40,
            height: 40,
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            backgroundColor: colors.surface
        },
        actionLabel: {
            color: colors.textMuted,
            fontSize: 12,
            fontWeight: "600",
            textAlign: "center",
            marginTop: 10
        },

        // Recent Transactions
        transactionsSection: {
            marginTop: 10,
        },
        transactionsSectionView: {
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "space-between"

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
            fontSize: 16,
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
            justifyContent: "space-between",
            flexDirection: "row",
            borderWidth: 1,
            borderColor: colors.text,
            borderRadius: 20,
            padding: 10,
            margin: 10,
            marginHorizontal: 5,
            paddingHorizontal: 5,
            color: colors.text

        },
        transactionTitle: {
            color: colors.text,
            fontSize: 16,
            fontWeight: "600",
        },
        transactionDate: {
            color: colors.textMuted,
            fontSize: 12,
            marginTop: 2,
        },
        transactionAmount: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.text,

        },
        transactionAmountContainer: {
            justifyContent: "center"
        },
        transactionTypeContainer:{
            justifyContent: "center"
        },
        transactionImage:{
            justifyContent:"center"
        },
        transactionDetailsImageAndType:{
            flexDirection:"row",
            gap: 10
        },
        transactionPositive: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.success,
        },
        transactionNegative: {
            fontSize: 16,
            fontWeight: "700",
            color: colors.danger,
        },
    });

    return styles;
};
