import { createHomeStyles } from '@/assets/styles/home.styles';
import useTheme from '@/hooks/useTheme';

import React from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


interface TransactionType {
    imageURI: string;
    transactionType: string;
    date: Date;
    amount: number;
}

const transactions: TransactionType[] = [
    {
        imageURI: "Image",
        transactionType: "Groceries",
        date: new Date('2026-01-24'),
        amount: 54.75,
    },
    {
        imageURI: "Image",
        transactionType: "Transport",
        date: new Date('2026-01-25'),
        amount: 12.50,
    },
    {
        imageURI: "Image",
        transactionType: "Salary",
        date: new Date('2026-01-26'),
        amount: 2500.00,
    },
     {
        imageURI: "Image",
        transactionType: "Salary",
        date: new Date('2026-01-26'),
        amount: 2500.00,
    }
]

const TransactionRow = ({ transaction }: { transaction: TransactionType }) => {

    const { colors } = useTheme();
    const homeStyles = createHomeStyles(colors);
    return (
        <View style={homeStyles.transactionDetails}>
            <View>
                {/* <Image
               source={}
               style={homeStyles.tra}
               /> */}
                <Text>{transaction.imageURI}</Text>
            </View>
            <View>
                <Text style={homeStyles.transactionTitle}>{transaction.transactionType}</Text>
                <Text style={homeStyles.transactionDate}>{transaction.date.toDateString()}</Text>
            </View>
            <View>
                <Text style={homeStyles.transactionAmount}>{transaction.amount.toFixed(2)}</Text>
            </View>
        </View>
    )

}

const Transaction = () => {
    return (
        <SafeAreaView>
            <ScrollView>
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.imageURI + item.date.getTime()} // Unique key for performance
                    renderItem={({ item }) => <TransactionRow transaction={item} />}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Transaction