import * as SecureStore from "expo-secure-store";

export const tokenCache = {
        async getToken(key: string) {
                try {
                        const token = await SecureStore.getItemAsync(key);
                        return token;
                } catch (err) {
                        return null;
                }
        },

        async saveToken(key: string, value: string) {
                try {
                        await SecureStore.setItemAsync(key, value);
                } catch (err) {
                        // ignore
                }
        },
};
