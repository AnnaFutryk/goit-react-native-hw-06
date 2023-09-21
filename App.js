import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StyleSheet, TouchableOpacity } from "react-native";
import { LoginScreen } from "./src/Screens/LoginScreen";

import { RegistrationScreen } from "./src/Screens/RegistrationScreen";
import { createStackNavigator } from "@react-navigation/stack";

import { SvgBack } from "./src/images/Svg";
import { Home } from "./src/Screens/Home";
import { CommentsScreen } from "./src/Screens/CommentsScreen";
import { MapScreen } from "./src/Screens/MapScreen";

const MainStack = createStackNavigator(); // вказує на групу навігаторів

export default function App() {
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <MainStack.Navigator style={styles.container} initialRouteName="Login">
        <MainStack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
        <MainStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <MainStack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <MainStack.Screen
          name="Comments"
          component={CommentsScreen}
          options={({ navigation }) => ({
            title: "Коментарі",
            headerTitleStyle: {
              fontSize: 17,
              textAlign: "center",
              fontFamily: "Roboto-Medium",
            },
            headerLeft: () => (
              <TouchableOpacity
                style={styles.backBtn}
                // onPress={() => navigation.navigate("PostsScreen")}
                onPress={() => navigation.goBack()}
              >
                <SvgBack />
              </TouchableOpacity>
            ),
          })}
        />
        <MainStack.Screen
          name="Map"
          component={MapScreen}
          options={({ navigation }) => ({
            title: "Карта",
            headerTitleStyle: {
              fontSize: 17,
              textAlign: "center",
              fontFamily: "Roboto-Medium",
            },
            headerLeft: () => (
              <TouchableOpacity
                style={styles.backBtn}
                // onPress={() => navigation.navigate("PostsScreen")}
                onPress={() => navigation.goBack()}
              >
                <SvgBack />
              </TouchableOpacity>
            ),
          })}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 44,
    paddingBottom: 32,
  },
  backBtn: { marginLeft: 16 },
});
