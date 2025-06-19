import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import SplashScreen from "../screens/SplashScreen";
import { NavigationContainer } from "@react-navigation/native";


const Stack = createStackNavigator();

const AppRoutes = () => {
    return (
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

const MainRoutes = () => {
    return (
        <NavigationContainer>
            <AppRoutes />
        </NavigationContainer>
    )
}

export default MainRoutes;