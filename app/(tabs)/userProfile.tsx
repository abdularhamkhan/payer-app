import useTheme from '@/hooks/useTheme'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const userProfile = () => {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  return (
    <SafeAreaView>
      <Text>userProfile</Text>
      <TouchableOpacity onPress={toggleDarkMode}>
        <Text>Change</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default userProfile