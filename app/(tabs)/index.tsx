
import useTheme from '@/hooks/useTheme'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
    const {toggleDarkMode}= useTheme();
  return (
    <SafeAreaView>
      <Text>Home</Text>
      <TouchableOpacity onPress={toggleDarkMode}>
        <Text>
            Hey
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Home