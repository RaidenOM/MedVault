import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AppProvider, { AppContext } from "./store/app-context";
import { useContext } from "react";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ReportsScreen from "./screens/ReportsScreen";
import AddReportScreen from "./screens/AddReportScreen";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={LoginScreen} name="LoginScreen" />
      <Stack.Screen component={RegisterScreen} name="RegisterScreen" />
    </Stack.Navigator>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeScreen") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "ReportsScreen") {
            iconName = focused ? "document" : "document-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2F7FF2", // Active tab color
        tabBarInactiveTintColor: "#999", // Inactive tab color
        tabBarStyle: {
          paddingVertical: 8, // Add padding to the tab bar
        },
      })}
    >
      <Tab.Screen
        component={HomeScreen}
        name="HomeScreen"
        options={{ title: "Home" }} // Add a title for the tab
      />
      <Tab.Screen
        component={ReportsScreen}
        name="ReportsScreen"
        options={{ title: "Reports" }} // Add a title for the tab
      />
    </Tab.Navigator>
  );
}

function MainAppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={Tabs} name="Tabs" />
      <Stack.Screen component={AddReportScreen} name="AddReportScreen" />
    </Stack.Navigator>
  );
}

function Navigation() {
  const { user } = useContext(AppContext);

  if (!user) return <AuthStack />;
  return <MainAppStack />;
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
      <StatusBar backgroundColor="black" style="light" />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
