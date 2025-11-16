// import Screen from '@/components/ui/Screen'
// import useTheme from '@/hooks/useTheme'
// import { useRouter } from 'expo-router'
// import React, { useEffect } from 'react'
// import { Image, Text, View } from 'react-native'

// const splashScreen = () => {
//     const { isDarkMode, colors } = useTheme();
//     const router = useRouter();
//     useEffect(() => {
//         const t = setTimeout(() => router.replace("/(tabs)/home"), 800);
//         return () => clearTimeout(t);
//     }, []);
//     return (
//         <Screen gradient>
//             <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//                 <Image
//                     source={require('@assets/images/splash.png')}
//                     style={{ width: 180, height: 180 }} />
//                 <View style={{ marginTop: 16, alignItems: "center" }}>
//                     <Text style={{ fontSize: 20, color: colors.text }}>Payer App</Text>
//                     <Text style={{ fontSize: 20, color: colors.text }}>Your Digital Payment Partner</Text>
//                 </View>
//             </View>
//         </Screen>
//     )
// }

// export default splashScreen