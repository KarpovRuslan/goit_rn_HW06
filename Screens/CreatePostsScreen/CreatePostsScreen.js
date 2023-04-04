import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import firebase from "../../firebase/config";

const CreatePostsScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [geolocation, setGeolocation] = useState(null);
  const [isFocus, setIsFocus] = useState(true);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [photo, setPhoto] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const { userId, displayName } = useSelector((state) => state.auth);

  const { storage, db } = firebase;

  const handleTitle = (text) => {
    setTitle(text);
  };
  const handleLocation = (text) => {
    setLocation(text);
  };

  const handleFocus = () => {
    setIsFocus(false);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
  }, []);
  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const clearPostData = () => {
    setPhoto("");
    setLocation("");
    setTitle("");
    setGeolocation(null);
  };

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }
  const getPhoto = async () => {
    setIsLoaded(true);
    const photo = await cameraRef.takePictureAsync();
    if (photo) {
      setPhoto(photo.uri);
      // await MediaLibrary.createAssetAsync(photo.uri);
      const location = await Location.getCurrentPositionAsync({});
      setGeolocation(location.coords);

      if (location.coords) {
        let { longitude, latitude } = location.coords;

        let regionName = await Location.reverseGeocodeAsync({
          longitude,
          latitude,
        });
        setLocationName(regionName[0].city + ", " + regionName[0].country);
      }
    }
  };
  const sendPhoto = () => {
    //uploadPhotoToServer();
    uploadPostToServer();
    navigation.navigate("DefaultScreen");
    setPhoto("");
    setLocation("");
    setGeolocation("");
    setTitle("");
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(photo);
    const file = await response.blob();
    const uniquePostId = Date.now().toString();
    const path = `images/${uniquePostId}.jpeg`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);

    const processedPhoto = await getDownloadURL(storageRef)
      .then((downloadURL) => {
        return downloadURL;
      })
      .catch((error) => {
        switch (error.code) {
          case "storage/object-not-found":
            console.log("storage/object-not-found");
            break;
          case "storage/unauthorized":
            console.log("storage/unauthorized");
            break;
          case "storage/canceled":
            console.log("storage/canceled");
            break;
          case "storage/unknown":
            console.log("storage/unknown");
            break;
        }
      });
    return processedPhoto;
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    const newPost = {
      title,
      location: geolocation,
      photoURL: photo,
      userId,
      displayName,
      locationName,
    };

    try {
      await addDoc(collection(db, "posts"), newPost);
    } catch (error) {
      console.error("Error while adding doc: ", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Camera
            style={styles.camera}
            type={type}
            ref={(ref) => {
              setCameraRef(ref);
            }}
          >
            {photo && (
              <View style={styles.photoContainer}>
                <Image
                  source={{ uri: photo }}
                  style={{ height: 260, width: 360 }}
                />
              </View>
            )}

            {!photo && (
              <View style={styles.photoView}>
                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={toggleCameraType}
                >
                  <MaterialIcons
                    name="flip-camera-ios"
                    size={24}
                    color="#fff"
                    style={{ marginRight: 10, marginTop: 7 }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={getPhoto}
                >
                  <MaterialIcons
                    name="photo-camera"
                    size={24}
                    color="#BDBDBD"
                  />
                </TouchableOpacity>
              </View>
            )}
          </Camera>

          <Text style={styles.downloadTitle}>
            {photo ? "Made photo again" : "Download photo"}
          </Text>

          <View style={{ paddingBottom: isFocus ? 100 : 20 }}>
            <TextInput
              onChangeText={handleTitle}
              onFocus={handleFocus}
              value={title}
              placeholder="Name..."
              placeholderTextColor="#BDBDBD"
              style={styles.inputTitle}
            />
            <View style={{ position: "relative" }}>
              <Feather
                name="map-pin"
                size={20}
                color="#BDBDBD"
                style={{ position: "absolute", bottom: 45 }}
              />
              <TextInput
                onChangeText={handleLocation}
                value={locationName}
                placeholder="Location..."
                placeholderTextColor="#BDBDBD"
                style={styles.inputLocation}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                ...styles.button,
                backgroundColor: locationName ? "#FF6C00" : "#F6F6F6",
              }}
              onPress={sendPhoto}
            >
              <Text
                style={{
                  ...styles.buttonText,
                  color: locationName ? "#fff" : "#BDBDBD",
                }}
              >
                Create Publication
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.trashIcon} onPress={clearPostData}>
              <Feather name="trash-2" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  photoView: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },

  flipButton: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },

  camera: {
    height: 260,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: "center",
    //backgroundColor: "#F6F6F6",
  },
  photoContainer: {
    backgroundColor: "#F6F6F6",
    position: "absolute",
    top: 0,
    left: 0,
  },
  addPhotoButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  downloadTitle: {
    marginBottom: 26,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
  },
  inputTitle: {
    height: 50,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  inputLocation: {
    height: 50,
    marginTop: 16,
    marginBottom: 28,
    paddingLeft: 28,
    fontSize: 16,
    lineHeight: 19,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  button: {
    backgroundColor: "#F6F6F6",
    paddingVertical: 16,
    borderRadius: 100,
  },
  buttonText: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
    textAlign: "center",
  },
  trashIcon: {
    backgroundColor: "#F6F6F6",
    height: 40,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 20,
    marginTop: 200,
  },
});

export default CreatePostsScreen;
