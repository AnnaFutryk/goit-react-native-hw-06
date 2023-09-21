import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { AntDesign, Feather, SimpleLineIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CreatePostsScreen } from "./CreatePostsScreen";
import { PostsScreen } from "./PostsScreen";
import { ProfileScreen } from "./ProfileScreen";
import { SvgBack, SvgLogOut } from "../images/Svg";
import { useRoute } from "@react-navigation/native";

const Tabs = createBottomTabNavigator();

export const Home = ({ navigation }) => {
  const {
    params: { login, email },
  } = useRoute();

  return (
    <Tabs.Navigator
      initialRouteName="PostsScreen"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { height: 88 },
      }}
    >
      <Tabs.Screen
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <SimpleLineIcons
                name="grid"
                size={24}
                color={color}
                style={{ marginLeft: 90 }}
              />
            );
          },
          title: "Публікації",
          headerTitleStyle: {
            fontSize: 17,
            textAlign: "center",
            fontFamily: "Roboto-Medium",
          },
          headerRight: () => (
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => navigation.navigate("Login")}
            >
              <SvgLogOut />
            </TouchableOpacity>
          ),
        }}
        name="PostsScreen"
        component={PostsScreen}
        initialParams={(login, email)}
      />
      <Tabs.Screen
        options={{
          tabBarIcon: () => {
            return (
              <View style={styles.addBtn}>
                <AntDesign
                  name="plus"
                  size={24}
                  color="white"
                  onPress={() => navigation.navigate("CreatePostsScreen")}
                />
              </View>
            );
          },
          title: "Створити публікацію",
          headerTitleStyle: {
            fontSize: 17,
            textAlign: "center",
            fontFamily: "Roboto-Medium",
          },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.navigate("PostsScreen")}
            >
              <SvgBack />
            </TouchableOpacity>
          ),
          tabBarStyle: { display: "none" },
          headerTitleAlign: "center",
        }}
        name="CreatePostsScreen"
        component={CreatePostsScreen}
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <Feather
                name="user"
                size={24}
                color={color}
                style={{ marginRight: 89 }}
              />
            );
          },
          headerShown: false,
        }}
        name="ProfileScreen"
        component={ProfileScreen}
      />
    </Tabs.Navigator>
  );
};

const styles = StyleSheet.create({
  logoutBtn: {
    marginRight: 16,
  },
  addBtn: {
    backgroundColor: "#FF6C00",
    height: 40,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  backBtn: { marginLeft: 16 },
});
