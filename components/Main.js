import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import { getUsersInfo } from "../redux/auth/authOperations";
import { StyleSheet, View } from "react-native";
import { useRoute } from "../router";

export const Main = () => {
  const { stateChange } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsersInfo());
  }, []);
  const routing = useRoute(stateChange);
  return (
    <NavigationContainer>
      <View style={styles.container}>{routing}</View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  image: {
    flex: 1,
    // resizeMode: "cover",
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
    //justifyContent: "flex-end",
  },
});
