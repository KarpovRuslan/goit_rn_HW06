import React from "react";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import DefaultScreen from "../nestedScreens/DefaultScreen";
import MapScreen from "../nestedScreens/MapScreen";
import CommentsScreen from "../nestedScreens/CommentsScreen";
import { Feather } from "@expo/vector-icons";
import { authSignOutUser } from "../../redux/auth/authOperations";

const NestedScreen = createStackNavigator();

const PostsScreen = () => {
  const dispatch = useDispatch();

  return (
    <NestedScreen.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: styles.titleStyle,
        headerStyle: {
          backgroundColor: "#ffffff",
          borderBottomWidth: 0.5,
          borderBottomColor: "#21212120",
        },
      }}
    >
      <NestedScreen.Screen
        name="DefaultScreen"
        component={DefaultScreen}
        options={{
          title: "Posts",
          headerTitleStyle: styles.titleStyle,

          headerRight: () => (
            <Feather
              name="log-out"
              color="#BDBDBD"
              size={24}
              style={{ marginRight: 15 }}
              onPress={() => {
                dispatch(authSignOutUser());
              }}
            />
          ),
        }}
      />
      <NestedScreen.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          title: "Comments",
          headerTitleStyle: styles.titleStyle,
          tabBarStyle: { display: "none" },
        }}
      />
      <NestedScreen.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: "Map",
          headerTitleStyle: styles.titleStyle,
          tabBarStyle: { display: "none" },
        }}
      />
    </NestedScreen.Navigator>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontFamily: "Roboto-Medium",
    color: "#212121",
    fontSize: 17,
    lineHeight: 22,
  },
});

export default PostsScreen;
