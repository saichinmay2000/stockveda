import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Dimensions, Animated, Appearance } from "react-native";
import { useNavigation, StackActions } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
    const navigation = useNavigation();
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Animate opacity and scale
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(scale, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();

        // Navigate to Home after delay
        const timeout = setTimeout(() => {
            navigation.dispatch(StackActions.replace("Home"));
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require("../assets/logo.png")}
                style={[
                    styles.logo,
                    {
                        opacity: opacity,
                        transform: [{ scale: scale }],
                    },
                ]}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#dadada",
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: width * 0.5,
        height: width * 0.5,
    },
});
