import React, { useState, useCallback, useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useDispatch } from "react-redux";
import { authSignUpUser } from "../../redux/auth/authOperations";

SplashScreen.preventAutoHideAsync();

const imgAdd = require("./img/add.png");
const imageBack = require("../../assets/images/photo.jpg");
const windowDimensions = Dimensions.get("window");
const screenDimensions = Dimensions.get("screen");

export default function RegistrationScreen({ navigation }) {
  const [displayName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [hidePass, setHidePass] = useState(true);

  const dispatch = useDispatch();

  const [fontsLoaded] = useFonts({
    "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("../../assets/fonts/Roboto-Regular.ttf"),
  });
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setDimensions({ window, screen });
      }
    );
    return () => subscription?.remove();
  });

  const nameHandler = (text) => setName(text);
  const emailHandler = (text) => setEmail(text);
  const passwordHandler = (text) => setPassword(text);

  const onRegister = () => {
    if (!displayName || !email || !password) {
      alert("Please make sure all fields are filled in correctly");
      return;
    }
    setIsShowKeyboard(false);
    dispatch(authSignUpUser({ email, password, displayName }));
  };

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    setIsFocusedName(false);
    setIsFocusedEmail(false);
    setIsFocusedPassword(false);
  };

  const onFocusName = () => {
    setIsShowKeyboard(true);
    setIsFocusedName(true);
  };
  const onFocusEmail = () => {
    setIsShowKeyboard(true);
    setIsFocusedEmail(true);
  };
  const onFocusPassword = () => {
    setIsShowKeyboard(true);
    setIsFocusedPassword(true);
    true;
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <ImageBackground source={imageBack} style={styles.image}>
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
          >
            <View style={styles.backGroundFrame}>
              <View style={styles.photoContainer}>
                <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
                  <ImageBackground
                    source={imgAdd}
                    style={{ width: "100%", height: "100%" }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.form}>
                <Text style={styles.textRegistration}>Registration Form</Text>
                <TextInput
                  value={displayName}
                  onChangeText={nameHandler}
                  placeholder="Name"
                  onFocus={onFocusName}
                  style={{
                    ...styles.input,
                    borderColor: isFocusedName ? "#FF6C00" : "#E8E8E8",
                  }}
                />
                <TextInput
                  value={email}
                  onChangeText={emailHandler}
                  placeholder="Email address"
                  onFocus={onFocusEmail}
                  style={{
                    ...styles.input,
                    borderColor: isFocusedEmail ? "#FF6C00" : "#E8E8E8",
                  }}
                />
                <View style={styles.passwordContainer}>
                  <TextInput
                    value={password}
                    onChangeText={passwordHandler}
                    placeholder="Password"
                    onFocus={onFocusPassword}
                    secureTextEntry={hidePass}
                    style={{
                      ...styles.inputPass,
                      marginBottom: isShowKeyboard ? 32 : 43,
                      borderColor: isFocusedPassword ? "#FF6C00" : "#E8E8E8",
                    }}
                  />
                  <TouchableOpacity
                    style={styles.showPassword}
                    activeOpacity={0.7}
                    onPress={() => {
                      setHidePass(!hidePass);
                    }}
                  >
                    <Text style={styles.showPasswordTitle}>Show</Text>
                  </TouchableOpacity>
                </View>

                {isShowKeyboard ? (
                  ""
                ) : (
                  <View>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={onRegister}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.buttonTitle}>Register</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.loginLink}
                      activeOpacity={0.7}
                      onPress={() => navigation.navigate("Login")}
                    >
                      <Text style={styles.textTitle}>
                        Already have an accout? Sign In
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  photoContainer: {
    marginTop: -60,
    height: 120,
    width: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    alignItems: "center",
  },
  addButton: {
    marginTop: "70%",
    left: "50%",
    height: 25,
    width: 25,
    pointerEvents: "auto",
  },
  input: {
    height: 50,
    width: 343,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingBottom: 15,
    paddingTop: 16,
    fontSize: 16,
    backgroundColor: "#F6F6F6",
    color: "#212121",
    fontFamily: "Roboto-Regular",
    position: "relative",
  },
  passwordContainer: {
    position: "relative",
  },
  inputPass: {
    height: 50,
    width: 343,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingBottom: 15,
    paddingTop: 16,
    backgroundColor: "#F6F6F6",
    color: "#212121",
    fontFamily: "Roboto-Regular",
    position: "relative",
  },
  showPasswordTitle: {
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    color: "#1B4371",
  },
  showPassword: {
    right: 16,
    top: 16,
    position: "absolute",
  },
  backGroundFrame: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
  },
  form: {
    marginHorizontal: 16,
    width: windowDimensions.width,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#FF6C00",
    marginBottom: 16,
    borderRadius: 100,
    height: 51,
    justifyContent: "center",
    width: 343,
  },
  buttonTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    textAlign: "center",
  },
  textTitle: {
    color: "#1B4371",
    fontSize: 16,
    marginBottom: 78,
    textAlign: "center",
    fontFamily: "Roboto-Regular",
  },
  textRegistration: {
    marginTop: 32,
    marginBottom: 33,
    fontSize: 30,
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
    lineHeight: 35,
  },
});
