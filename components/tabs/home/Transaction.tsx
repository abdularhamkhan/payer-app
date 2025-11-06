import { createHomeStyles } from '@/assets/styles/home.styles';
import useTheme from '@/hooks/useTheme';

import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


interface TransactionType {
    imageURI?: string | null;
    transactionType: string;
    date: Date;
    amount: number;
    isCredited: boolean;
    createdAt: Date | string | number;
}

const transactions: TransactionType[] = [
    {
        imageURI: "Image1",
        transactionType: "Groceries",
        date: new Date('2026-01-24'),
        amount: 54.75,
        isCredited: false,
        createdAt: "1"
    },
    {
        imageURI: "Image2",
        transactionType: "Transport",
        date: new Date('2026-01-25'),
        amount: 12.50,
        isCredited: false,
        createdAt: "2"

    },
    {
        imageURI: "Image3",
        transactionType: "Salary",
        date: new Date('2026-01-26'),
        amount: 2500.00,
        isCredited: true,
        createdAt: "3"


    },
    {
        imageURI: null,
        transactionType: "Salary",
        date: new Date('2026-01-26'),
        amount: 2500.00,
        isCredited: true,
        createdAt: "4"

    },

    {
        imageURI: "Image1",
        transactionType: "Groceries",
        date: new Date('2026-01-24'),
        amount: 54.75,
        isCredited: false,
        createdAt: "5"
    },
    {
        imageURI: "Image2",
        transactionType: "Transport",
        date: new Date('2026-01-25'),
        amount: 12.50,
        isCredited: false,
        createdAt: "6"

    },
    {
        imageURI: "Image3",
        transactionType: "Salary",
        date: new Date('2026-01-26'),
        amount: 2500.00,
        isCredited: true,
        createdAt: "7"


    },
    {
        imageURI: null,
        transactionType: "Salary",
        date: new Date('2026-01-26'),
        amount: 2500.00,
        isCredited: true,
        createdAt: "8"

    },
    {
        imageURI: "Image1",
        transactionType: "Groceries",
        date: new Date('2026-01-24'),
        amount: 54.75,
        isCredited: false,
        createdAt: "12"
    },
    {
        imageURI: "Image2",
        transactionType: "Transport",
        date: new Date('2026-01-25'),
        amount: 12.50,
        isCredited: false,
        createdAt: "11"

    },
    {
        imageURI: "Image3",
        transactionType: "Salary",
        date: new Date('2026-01-26'),
        amount: 2500.00,
        isCredited: true,
        createdAt: "10"


    },
    {
        imageURI: null,
        transactionType: "Salary",
        date: new Date('2026-01-26'),
        amount: 2500.00,
        isCredited: true,
        createdAt: "9"

    },
]

const TransactionRow = ({ transaction }: { transaction: TransactionType }) => {

    const { colors } = useTheme();
    const homeStyles = createHomeStyles(colors);
    const defaultImageSrc = require('@/assets/images/icon.png');
    return (
        <View style={homeStyles.transactionDetails}>
            <View style={homeStyles.transactionDetailsImageAndType}>
                <View style={homeStyles.transactionImage}>
                    <Image
                        source={transaction.imageURI ? { uri: transaction.imageURI } : defaultImageSrc}
                        style={homeStyles.avatar}
                        resizeMode="cover"
                    />
                </View>
                <View style={homeStyles.transactionTypeContainer}>
                    <Text style={homeStyles.transactionTitle}>{transaction.transactionType}</Text>
                    <Text style={homeStyles.transactionDate}>{transaction.date.toDateString()}</Text>
                </View>
            </View>
            <View style={homeStyles.transactionAmountContainer}>
                <Text style={transaction.isCredited ? homeStyles.transactionPositive : homeStyles.transactionNegative}> {transaction.isCredited ? "+" : "-"}{transaction.amount.toFixed(2)}</Text>
            </View>
        </View>
    )

}

const Transaction = () => {
    return (
        <SafeAreaView>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.createdAt.toString()} // Unique key for performance
                renderItem={({ item }) => <TransactionRow transaction={item} />}
            />
        </SafeAreaView>
    )
}

export default Transaction