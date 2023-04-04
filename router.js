import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Screens/Home/Home";
import LoginScreen from "./Screens/Auth/LoginScreen";
import RegistrationScreen from "./Screens/Auth/RegistrationScreen";

const MainScreen = createStackNavigator();

export const useRoute = (isAuth) => {
  if (!isAuth) {
    return (
      <MainScreen.Navigator initialRouteName="Login">
        <MainScreen.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
        <MainScreen.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <MainScreen.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
      </MainScreen.Navigator>
    );
  }
  return <Home />;
};
