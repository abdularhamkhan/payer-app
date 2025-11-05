import { createHomeStyles } from '@/assets/styles/home.styles';
import useTheme from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

const Header = () => {
    const { isDarkMode, colors } = useTheme();
    const homeStyles = createHomeStyles(colors);

    const MAX_LENGTH = 17;
    const username = "Abdul Arham Khan Rind";

    // Step 1: Trim to max length
    let displayName = username.trim();

    // Step 2: If longer than limit, find last space before 17
    if (displayName.length > MAX_LENGTH) {
        const cutoff = displayName.lastIndexOf(" ", MAX_LENGTH);
        displayName = displayName.slice(0, cutoff > 0 ? cutoff : MAX_LENGTH).trim();
    }

    const [avatarUri, setAvatarUri] = useState<string | null>(null);

    // Load saved avatar from AsyncStorage when component mounts
    useEffect(() => {
        (async () => {
            const storedUri = await AsyncStorage.getItem("user_avatar_uri");
            if (storedUri) setAvatarUri(storedUri);
        })();
    }, []);

    // Function to pick and store image
    const uploadImage = async () => {
        try {
            // Ask for media library permission
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert("Permission Required", "Please allow access to your gallery to upload a profile photo.");
                return;
            }

            // Open the image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            // If user cancels
            if (result.canceled) return;

            const selectedUri = result.assets[0].uri;

            // Save in state and AsyncStorage
            setAvatarUri(selectedUri);
            await AsyncStorage.setItem("user_avatar_uri", selectedUri);
        } catch (error) {
            console.error("Image upload error:", error);
            Alert.alert("Error", "Something went wrong while uploading your photo.");
        }
    };


    return (

        <View style={homeStyles.headerContainer}>

            <TouchableOpacity onPress={uploadImage}>
                <View style={homeStyles.profileSection}>
                    <Image
                        source={
                            avatarUri
                                ? { uri: avatarUri }
                                : require('@/assets/images/icon.png')
                        }
                        style={homeStyles.avatar}
                    />
                </View>
            </TouchableOpacity>

            <Text style={homeStyles.headerText}
            > Hi, {displayName}
            </Text>
            <View style={homeStyles.notificationButton}>
                <Ionicons name='notifications-outline' size={24} color={isDarkMode ? colors.textMuted : "black"} />
            </View>

        </View>

    )
}

export default Header