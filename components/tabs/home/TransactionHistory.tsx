import { createHomeStyles } from '@/assets/styles/home.styles';
import useTheme from '@/hooks/useTheme';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Transaction from './Transaction';

const TransactionHistory = () => {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);
  const viewAllTransactionHistory = () => {
    
  }
  return (
    <View style={homeStyles.transactionsSection}>
      <View style={homeStyles.transactionsSectionView}>
        <Text style={homeStyles.transactionTitle}>TransactionHistory</Text>
        <TouchableOpacity onPress={viewAllTransactionHistory}>
          <Text style={homeStyles.seeAll}>
            See All
          </Text>
        </TouchableOpacity>
      </View>
      <Transaction />
    </View>
  )
}

export default TransactionHistory