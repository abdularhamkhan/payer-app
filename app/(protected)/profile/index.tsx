// app/(protected)/profile/index.tsx
import Screen from "@/components/ui/Screen";
import useTheme from "@/hooks/useTheme";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

/**
 * Profile screen: update basic user info and sign out.
 * Wire update logic with Convex patch/mutation (TODO).
 */

export default function ProfileScreen() {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  // TODO: initialize these from Convex user row when available
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [address, setAddress] = useState("");

  const handleUpdate = async () => {
    // TODO: call Convex mutation to update user profile
    Alert.alert("Saved", "Profile updated (stub).");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/onboarding/login");
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  return (
    <Screen>
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>

        <Text style={[styles.label, { color: colors.textMuted }]}>First Name</Text>
        <TextInput value={firstName} onChangeText={setFirstName} style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} />

        <Text style={[styles.label, { color: colors.textMuted }]}>Last Name</Text>
        <TextInput value={lastName} onChangeText={setLastName} style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} />

        <Text style={[styles.label, { color: colors.textMuted }]}>Address</Text>
        <TextInput value={address} onChangeText={setAddress} style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} />

        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleUpdate}>
          <Text style={{ color: "white", fontWeight: "700" }}>Update Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.signoutBtn, { borderColor: colors.border }]} onPress={handleSignOut}>
          <Text style={{ color: colors.danger }}>Sign out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 12 }} onPress={toggleDarkMode}>
          <Text style={{ color: colors.primary }}>Toggle theme (current: {isDarkMode ? "dark" : "light"})</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },

  label: { marginTop: 12, marginBottom: 6, fontSize: 13 },
  input: { height: 48, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 },

  saveBtn: { marginTop: 20, paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  signoutBtn: { marginTop: 12, paddingVertical: 12, borderRadius: 10, alignItems: "center", borderWidth: 1 },
});


// // app/(protected)/profile/index.tsx
// import Screen from "@/components/ui/Screen";
// import useTheme from "@/hooks/useTheme";
// import { useAuth } from "@clerk/clerk-expo";
// import { useRouter } from "expo-router";
// import React from "react";
// import { Text, TouchableOpacity, View } from "react-native";

// export default function ProfileScreen() {
//   const { colors, isDarkMode, toggleDarkMode } = useTheme();
//   const { signOut } = useAuth();
//   const router = useRouter();

//   const handleSignOut = async () => {
//     await signOut();
//     router.replace("/onboarding/login");
//   };

//   return (
//     <Screen>
//       <View style={{ padding: 16 }}>
//         <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>Profile</Text>

//         <TouchableOpacity onPress={toggleDarkMode} style={{ marginTop: 16 }}>
//           <Text style={{ color: colors.primary }}>Toggle Theme (current: {isDarkMode ? "dark" : "light"})</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={handleSignOut} style={{ marginTop: 16 }}>
//           <Text style={{ color: colors.danger }}>Sign out</Text>
//         </TouchableOpacity>
//       </View>
//     </Screen>
//   );
// }
