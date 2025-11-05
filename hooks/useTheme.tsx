import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface ColorScheme {
    bg: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    primary: string;
    success: string;
    warning: string;
    danger: string;
    shadow: string;
    gradients: {
        background: [string, string];
        surface: [string, string];
        primary: [string, string];
        success: [string, string];
        warning: [string, string];
        danger: [string, string];
        muted: [string, string];
        empty: [string, string];
    };
    backgrounds: {
        input: string;
        editInput: string;
    };
    statusBarStyle: "light-content" | "dark-content";
}



export const darkColorScheme: ColorScheme = {
    bg: "#0E1013", // deep charcoal background
    surface: "#1E2328", // surface cards
    text: "#FFFFFF", // main text
    textMuted: "#A0A6AD", // muted labels
    border: "#252A30",
    primary: "#7F5AF0", // violet primary
    success: "#00C46C", // income green
    warning: "#FACC15", // yellow/gold (not much used, but defined)
    danger: "#FF4D4D", // expense red
    shadow: "#000000",

    gradients: {
        background: ["#0E1013", "#1E2328"], // dark subtle background blend
        surface: ["#1E2328", "#252A30"],
        primary: ["#7F5AF0", "#5AD8FA"], // purple → skyblue gradient (used on buttons, cards)
        success: ["#00C46C", "#10B981"],
        warning: ["#FACC15", "#EAB308"],
        danger: ["#FF4D4D", "#EF4444"],
        muted: ["#2D3138", "#3A3F45"],
        empty: ["#1E2328", "#0E1013"],
    },

    backgrounds: {
        input: "#1E2328",
        editInput: "#2D3138",
    },

    statusBarStyle: "light-content" as const,
};



export const lightColorScheme: ColorScheme = {
    bg: "#F9FAFB", // near-white background
    surface: "#FFFFFF",
    text: "#0E1013",
    textMuted: "#4B5563",
    border: "#E5E7EB",
    primary: "#7F5AF0", // same purple for brand consistency
    success: "#00C46C",
    warning: "#EAB308",
    danger: "#EF4444",
    shadow: "#000000",

    gradients: {
        background: ["#F9FAFB", "#E5E7EB"],
        surface: ["#FFFFFF", "#F3F4F6"],
        primary: ["#7F5AF0", "#5AD8FA"],
        success: ["#10B981", "#6EE7B7"],
        warning: ["#FACC15", "#FDE68A"],
        danger: ["#EF4444", "#F87171"],
        muted: ["#CBD5E1", "#94A3B8"],
        empty: ["#E5E7EB", "#F3F4F6"],
    },

    backgrounds: {
        input: "#FFFFFF",
        editInput: "#F9FAFB",
    },

    statusBarStyle: "dark-content" as const,
};


interface ThemeContextType {
    isDarkMode: Boolean;
    toggleDarkMode: () => void;
    colors: ColorScheme;
}

const ThemeContext = createContext<undefined | ThemeContextType>(undefined);


export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setIsDArkMode] = useState(false);

    useEffect(() => {
        // this will get the user's choice 
        AsyncStorage.getItem("darkMode").then((value) => {
            if (value)
                setIsDArkMode(JSON.parse(value))
        })

    })

    const toggleDarkMode = async () => {
        const newMode = !isDarkMode;
        setIsDArkMode(newMode);
        await AsyncStorage.setItem("darkMode", JSON.stringify(newMode));
    }

    const colors = isDarkMode ? darkColorScheme : lightColorScheme;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
            {children}
        </ThemeContext.Provider>
    )
}

const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context == undefined) {
        throw new Error("useTheme must be used within a Theme Provider")
    }

    return context;
}

export default useTheme