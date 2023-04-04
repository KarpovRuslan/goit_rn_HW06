import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { authSignOutUser } from "../../redux/auth/authOperations";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import firebase from "../../firebase/config";
import { Feather, EvilIcons } from "@expo/vector-icons";

const imageBack = require("../../assets/images/photo.jpg");
const imgAdd = require("../Auth/img/add.png");

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userId, displayName } = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);
  const { db } = firebase;

  useEffect(() => {
    getUserPosts();
  }, []);

  const getUserPosts = async () => {
    const q = collection(db, "posts");
    await onSnapshot(query(q, where("userId", "==", userId)), (snapshot) => {
      const posts = [];
      snapshot.forEach((doc) => {
        posts.push({ ...doc.data(), idPost: doc.id });
      });
      setUserPosts(posts);
    });
  };

  const signOut = () => {
    dispatch(authSignOutUser());
  };

  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );

  const [windowHeight, setWindowHeight] = useState(
    Dimensions.get("window").height
  );

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width;
      setWindowWidth(width);
      const height = Dimensions.get("window").height;
      setWindowHeight(height);
    };
    const dimensionsHandler = Dimensions.addEventListener("change", onChange);

    return () => dimensionsHandler?.remove();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={imageBack} style={styles.image}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <View style={styles.wrapper}>
            <View style={styles.logoutBtn}>
              <Feather
                name="log-out"
                color="#BDBDBD"
                size={24}
                onPress={signOut}
              />
            </View>
            <View style={styles.avatarWrapper}>
              <TouchableOpacity style={styles.btnAdd} activeOpacity={0.7}>
                <Image source={imgAdd} style={styles.addIcon} />
              </TouchableOpacity>
            </View>
            <Text style={styles.headerTitle}>{displayName}</Text>

            <View style={styles.postWrapper}>
              <FlatList
                data={userPosts}
                keyExtractor={(item) => item.idPost}
                renderItem={({ item }) => (
                  <View style={styles.listWrapper}>
                    <Image
                      source={{ uri: item.photoURL }}
                      style={{
                        ...styles.postPhoto,
                        width: windowWidth - 16 * 2,
                      }}
                    />
                    <Text style={styles.postTitle}>{item.title}</Text>
                    <View style={styles.linksWrapper}>
                      <View style={styles.wrap}>
                        <TouchableOpacity
                          style={styles.link}
                          activeOpacity={0.7}
                          onPress={() => {
                            navigation.navigate("Comments", {
                              postId: item.idPost,
                              photoURL: item.photoURL,
                            });
                          }}
                        >
                          <Feather
                            name="message-circle"
                            size={24}
                            color="#BDBDBD"
                          />
                          <Text style={{ ...styles.count, marginLeft: 6 }}>
                            {0}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ ...styles.link, marginLeft: 24 }}
                          activeOpacity={0.7}
                        >
                          <EvilIcons name="like" size={35} color="#BDBDBD" />
                          <Text style={styles.count}>{32}</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        style={styles.link}
                        activeOpacity={0.7}
                        onPress={() => {
                          navigation.navigate("Map", {
                            location: item.location,
                          });
                        }}
                      >
                        <Feather name="map-pin" size={24} color="#BDBDBD" />
                        <Text style={styles.locationText}>
                          {item.locationName}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    paddingTop: 147,
  },
  wrapper: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 60,
    paddingTop: 92,
    alignItems: "center",
  },
  logoutBtn: {
    position: "absolute",
    top: 20,
    right: 16,
  },
  headerTitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    lineHeight: 35,
    color: "#212121",
    marginBottom: 33,
    textAlign: "center",
  },
  avatarWrapper: {
    height: 120,
    width: 120,
    borderRadius: 16,
    position: "absolute",
    top: -60,
    backgroundColor: "#F6F6F6",
  },
  avatar: { height: "100%", width: "100%", borderRadius: 16 },
  btnAdd: {
    height: 25,
    width: 25,
    backgroundColor: "#ffffff",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    position: "absolute",
    bottom: 12,
    right: -12,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listWrapper: {
    marginBottom: 10,
  },
  postWrapper: {
    marginBottom: 125,
  },
  postPhoto: {
    height: 240,
    marginBottom: 8,
    borderRadius: 8,
  },
  postTitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
    marginBottom: 8,
  },
  linksWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  wrap: {
    flexDirection: "row",
  },
  link: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  count: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
  },
});

export default ProfileScreen;
