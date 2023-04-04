import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import firebase from "../../firebase/config";
import { useSelector } from "react-redux";
import { Feather, Ionicons } from "@expo/vector-icons";

const CommentsScreen = ({ route }) => {
  const { postId, photoURL } = route.params;
  const { userId, displayName } = useSelector((state) => state.auth);

  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const createComment = async () => {
    const result = { userName: displayName, comment, dateComment: Date.now() };
    await updateDoc(doc(firebase.db, "posts", `${postId}`), {
      comments: arrayUnion(result),
    });
    keyboardHide();
    setComment("");
  };

  const getAllComents = async () => {
    onSnapshot(doc(firebase.db, "posts", `${postId}`), (doc) => {
      const postsComments = doc.data().comments;
      postsComments && setAllComments(postsComments);
    });
  };

  useEffect(() => {
    getAllComents();
  }, []);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""}>
          <Image source={{ uri: photoURL }} style={{ ...styles.postPhoto }} />
        </KeyboardAvoidingView>

        {allComments.length > 0 && (
          <FlatList
            data={allComments}
            keyExtractor={(item) => item.dateComment.toString()}
            renderItem={({ item }) => {
              const newDate = new Date(item.dateComment);
              const date = newDate.toLocaleString();

              return (
                <View style={styles.commentWrapper}>
                  <View style={styles.commentIcon}>
                    {item.userPhotoUri && (
                      <Image
                        source={{ uri: item.userPhotoUri }}
                        style={styles.commentPhoto}
                      />
                    )}
                  </View>
                  <View style={styles.commentTextWrapper}>
                    <Text style={styles.commentText}>{item.comment}</Text>
                    <Text style={styles.commentDate}>{date}</Text>
                  </View>
                </View>
              );
            }}
          />
        )}
        <View>
          <TextInput
            style={styles.input}
            placeholder={"Place comment..."}
            placeholderTextColor={"#BDBDBD"}
            onChangeText={(value) => {
              setComment(value);
            }}
            value={comment}
          />
          <TouchableOpacity
            onPress={createComment}
            activeOpacity={0.7}
            style={styles.inputBtn}
          >
            <Feather name="arrow-up" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 32,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  postPhoto: {
    height: 240,
    marginBottom: 32,
    borderRadius: 8,
  },
  input: {
    color: "#212121",
    height: 50,
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    lineHeight: 19,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    marginBottom: 16,
    marginTop: 16,
    borderRadius: 100,
    borderColor: "#E8E8E8",
    borderWidth: 1,
    backgroundColor: "#F6F6F6",
    paddingLeft: 16,
    paddingRight: 50,
  },
  inputBtn: {
    position: "absolute",
    top: 24,
    right: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 34,
    height: 34,
    borderRadius: 100,
    backgroundColor: "#FF6C00",
  },
  commentWrapper: {
    flexDirection: "row",
    marginBottom: 24,
  },
  commentIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1B4371",
    borderRadius: 14,
    marginRight: 16,
    overflow: "hidden",
  },
  commentPhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
  commentTextWrapper: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    padding: 16,
    borderRadius: 6,
  },
  commentText: {
    fontFamily: "Roboto-Regular",
    fontSize: 13,
    lineHeight: 18,
    color: "#212121",
    marginBottom: 8,
  },
  commentDate: {
    fontFamily: "Roboto-Regular",
    fontSize: 10,
    lineHeight: 12,
    textAlign: "right",
    color: "rgba(189, 189, 189, 1)",
  },
});

export default CommentsScreen;
