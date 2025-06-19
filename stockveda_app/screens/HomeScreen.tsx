import React, { useState, useRef, useEffect } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    Platform,
    Image,
    StatusBar,
    Linking,
    Appearance,
    SafeAreaView,
    KeyboardAvoidingView,
} from "react-native";
import {
    Appbar,
    TextInput,
    Chip,
    Text,
    Menu,
} from "react-native-paper";
import app from '../app.json'

export default function HomeScreen() {
    const [question, setQuestion] = useState("");
    type Message = { isUser: boolean; text: string; sources?: string[]; };
    const initialMessage = {
        isUser: false,
        text: "Hi there! 👋 I'm your AI assistant. Ask me anything about the stock market or a company.",
    };
    const [history, setHistory] = useState<Message[]>([initialMessage]);
    const [loading, setLoading] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [hasUserAsked, setHasUserAsked] = useState(false);
    const scrollViewRef = useRef<ScrollView | null>(null);
    const companyChips = ["Swiggy", "Eternal", "Infosys", "Reliance", "HDFC", "Wipro"];

    const handleAsk = async () => {
        if (!question.trim()) return;

        const userQuestion = question;
        setHasUserAsked(true);
        setHistory(prev => [...prev, { isUser: true, text: userQuestion }]);
        setQuestion("");
        setLoading(true);

        try {
            const response = await fetch(`${app.api_url}/ask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: userQuestion }),
            });

            const data = await response.json();

            const botAnswer = data?.answer || "Sorry, I couldn't understand that.";
            const sources = data?.sources || [];

            setHistory(prev => [
                ...prev,
                {
                    isUser: false,
                    text: botAnswer,
                    sources,
                },
            ]);
        } catch (error) {
            console.error("Error fetching answer:", error);
            setHistory(prev => [
                ...prev,
                { isUser: false, text: "Something went wrong. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [history, loading]);

    const handleNewChat = () => {
        setHistory([initialMessage]);
        setHasUserAsked(false);
        setQuestion("");
    };

    return (
        <>
            <StatusBar barStyle="dark-content" />
            <Appbar.Header style={styles.appbar} mode="small" elevated theme={{}}>
                <Appbar.Content
                    title="StockVeda"
                    titleStyle={{ fontSize: 20, fontWeight: "bold" }}
                />
                <Appbar.Action icon="plus-circle-outline" onPress={handleNewChat} accessibilityLabel="New Chat" />
                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <Appbar.Action
                            icon="dots-vertical"
                            color={isDarkMode ? "#F9FAFB" : "#111827"}
                            onPress={() => setMenuVisible(true)}
                            accessibilityLabel="Menu"
                        />
                    }
                >
                    <Menu.Item
                        onPress={() => {
                            setMenuVisible(false);
                            Linking.openURL(`${app.privacy_url}`);
                        }}
                        title="Privacy Policy"
                        leadingIcon="shield-lock-outline"
                    />
                </Menu>
            </Appbar.Header>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : 'height'}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
                <SafeAreaView
                    style={{ flex: 1, backgroundColor: "#F9FAFB" }}
                // behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            style={styles.scroll}
                            ref={scrollViewRef}
                            contentContainerStyle={{ paddingBottom: 130 }}
                        >
                            {!hasUserAsked && (
                                <View style={styles.heroWrapper}>
                                    <View style={styles.hero}>
                                        <Text variant="headlineMedium" style={styles.heroTitle}>
                                            Get Instant Answers to Your Financial Questions
                                        </Text>
                                        <Text variant="bodyMedium" style={styles.heroSubtitle}>
                                            Powered by smart AI. Simple, fast, and accurate.
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {history.map((msg, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.messageContainer,
                                        msg.isUser ? styles.userMessage : styles.botMessage,
                                    ]}
                                >
                                    {!msg.isUser && (
                                        <Image source={require("../assets/ai.png")} style={styles.avatar} />
                                    )}
                                    <View style={[styles.bubble, msg.isUser ? styles.userBubble : styles.botBubble]}>
                                        <Text style={[styles.messageText, msg.isUser ? styles.userText : styles.botText]}>
                                            {msg.text}
                                        </Text>
                                        {msg.sources && msg.sources.length > 0 && (
                                            <View style={{ marginTop: 8 }}>
                                                {msg.sources.map((src, i) => (
                                                    <View key={i} style={{ flexDirection: "row", marginBottom: 4 }}>
                                                        <Text style={{ fontSize: 12, color: "#3B82F6" }}>• </Text>
                                                        <Text
                                                            style={{ fontSize: 12, color: "#3B82F6", flex: 1 }}
                                                            onPress={() => Linking.openURL(src)}
                                                            numberOfLines={2}
                                                            ellipsizeMode="tail"
                                                        >
                                                            {src}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                    {msg.isUser && (
                                        <Image source={require("../assets/user.png")} style={styles.avatar} />
                                    )}
                                </View>
                            ))}

                            {loading && (
                                <View style={[styles.messageContainer, styles.botMessage]}>
                                    <Image source={require("../assets/ai.png")} style={styles.avatar} />
                                    <View style={[styles.bubble, styles.botBubble]}>
                                        <Text style={[styles.messageText, styles.botText, { opacity: 0.6 }]}>
                                            Typing...
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </ScrollView>

                        {/* Chips just above input */}
                        {!hasUserAsked && (
                            <ScrollView style={styles.chipRow} horizontal showsHorizontalScrollIndicator={false}>
                                {companyChips.map((chip, idx) => (
                                    <Chip
                                        key={idx}
                                        theme={{ roundness: 20 }}
                                        mode="outlined"
                                        onPress={() => setQuestion(chip)}
                                        style={styles.chip}
                                        textStyle={{ fontSize: 13, color: isDarkMode ? "#000" : "#000", }}
                                    >
                                        {chip}
                                    </Chip>
                                ))}
                            </ScrollView>
                        )}

                        {/* Input Area */}
                        <View style={styles.inputArea}>
                            <TextInput
                                theme={{ roundness: 25 }}
                                value={question}
                                onChangeText={setQuestion}
                                placeholder="Ask a financial question..."
                                mode="outlined"
                                style={styles.input}
                                contentStyle={{ fontSize: 14 }}
                                right={<TextInput.Icon icon="send" onPress={handleAsk} />}
                                autoCapitalize="sentences"
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </>
    );
}

const theme = Appearance.getColorScheme();
const isDarkMode = theme === "dark";
const styles = StyleSheet.create({
    appbar: {
        zIndex: 10,
        backgroundColor: isDarkMode ? "#1F2937" : "#F9FAFB",
        position: 'relative',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    scroll: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: isDarkMode ? "#111827" : "#ffffff",
    },
    hero: {
        alignItems: "center",
        marginVertical: 24,
    },
    heroTitle: {
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: isDarkMode ? "#F9FAFB" : "#111827",
    },
    heroSubtitle: {
        textAlign: "center",
        color: isDarkMode ? "#F9FAFB" : "#111827",
        opacity: 0.6,

    },
    heroWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    messageContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginVertical: 6,
    },
    userMessage: {
        justifyContent: "flex-end",
    },
    botMessage: {
        justifyContent: "flex-start",
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginHorizontal: 6,
    },
    bubble: {
        maxWidth: "75%",
        padding: 10,
        borderRadius: 20,
    },
    userBubble: {
        backgroundColor: "#6366f1",
        borderBottomRightRadius: 0,
    },
    botBubble: {
        backgroundColor: "#e0e1e1",
        borderBottomLeftRadius: 0,
    },
    messageText: {
        fontSize: 14,
        color: isDarkMode ? "#F9FAFB" : "#111827",
    },
    userText: {
        color: "#fff",
    },
    botText: {
        color: "#111827",
    },
    inputArea: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        padding: 12,
        backgroundColor: isDarkMode ? "#111827" : "#ffffff",
        borderTopWidth: 1,
        borderColor: isDarkMode ? "#111827" : "#ffffff",
        paddingBottom: 30,
    },
    input: {
        flex: 1,
        marginRight: 8,
        backgroundColor: isDarkMode ? "#000" : "#fff",
        borderRadius: 25,
    },
    askButton: {
        borderRadius: 25,
    },
    chipRow: {
        position: "absolute",
        bottom: 110,
        // left: 0,
        // right: 0,
        // flexDirection: "row",
        // flexWrap: "wrap",
        // justifyContent: "center",
        // paddingHorizontal: 12,
    },
    chip: {
        margin: 4,
        backgroundColor: "#E5E7EB",
    },
});
