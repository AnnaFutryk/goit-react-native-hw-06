import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  TextInput,
  Text,
} from "react-native";
import { Comment } from "../Components/Comment";
import { SvgPostSubmit } from "../images/Svg";
import { useSelector } from "react-redux";
import {
  selectUserAvatar,
  selectUserId,
  selectUserName,
} from "../redux/auth/authSelectors";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebase/config";

const schema = yup.object().shape({
  comment: yup.string().required("Введіть коментар"),
});

export const CommentsScreen = ({ route }) => {
  const { id, url } = route.params;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const name = useSelector(selectUserName);
  const avatar = useSelector(selectUserAvatar);
  const userId = useSelector(selectUserId);

  const [isFocusedInput, setIsFocusedInput] = useState(false);

  const SubmitComment = async () => {
    if (!comment) {
      return;
    }
    try {
      await addDoc(collection(FIRESTORE_DB, "posts", id, "comments"), {
        comment,
        owner: { userId, name, avatar },
        createdAt: new Date().getTime(),
      });
      setComment("");
      reset();
    } catch (error) {
      console.log(error.code);
    }
  };

  // const SubmitComent = ({ comment }) => {
  //   setComment(comment);
  //   console.log(comment);
  //   setComment("");
  //   reset();
  // };

  useEffect(() => {
    const commentsCollection = collection(
      FIRESTORE_DB,
      "posts",
      id,
      "comments"
    );
    onSnapshot(commentsCollection, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map((doc) => ({
        commentId: doc.id,
        ...doc.data(),
      }));
      const sortedCommentsData = commentsData.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setComments(sortedCommentsData);
    });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "position" : "height"}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Image style={styles.img} source={{ uri: url ? url : null }} />
          <View style={styles.commentWrapper}>
            {comments.length !== 0 ? (
              comments.map(({ commentId, comment, owner, createdAt }) => (
                <Comment
                  key={commentId}
                  commentId={commentId}
                  comment={comment}
                  owner={owner}
                  createdAt={createdAt}
                  style={{
                    flexDirection:
                      userId !== owner.userId ? "row" : "row-reverse",
                  }}
                />
              ))
            ) : (
              <View style={{ flex: 1, marginTop: 30, paddingHorizontal: 16 }}>
                <Text style={styles.comment}>Залиште коментар</Text>
              </View>
            )}
          </View>
        </ScrollView>
        <View style={styles.formContainer}>
          {errors.comment && <Text>{errors.comment.message}</Text>}
          <Controller
            control={control}
            name="comment"
            render={({ field }) => (
              <>
                <TextInput
                  style={[styles.input, isFocusedInput && styles.inputFocused]}
                  placeholderTextColor={"#BDBDBD"}
                  placeholder="Коментувати..."
                  name="comment"
                  value={comment}
                  onChangeText={(text) => {
                    setComment(text);
                    field.onChange(text);
                  }}
                  onFocus={() => setIsFocusedInput(true)}
                  onBlur={() => setIsFocusedInput(false)}
                />
                <TouchableOpacity
                  style={styles.postBtn}
                  onPress={handleSubmit(SubmitComment)}
                >
                  <SvgPostSubmit />
                </TouchableOpacity>
              </>
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    backgroundColor: "#fff",
    flex: 1,
  },
  scroll: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  commentWrapper: {
    flex: 1,
    paddingBottom: 31,
  },
  img: {
    width: "100%",
    height: 240,
    borderRadius: 8,
    marginBottom: 32,
    marginTop: 32,
  },
  formContainer: {
    position: "absolute",
    bottom: -34,
    left: 0,
    right: 0,
    padding: 16,
  },
  input: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#212121",
    padding: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E8E8E8",
    backgroundColor: "#F6F6F6",
    borderRadius: 25,
  },
  inputFocused: {
    borderColor: "#FF6C00",
    backgroundColor: "#fff",
    color: "#000",
    paddingRight: 46,
  },
  postBtn: {
    position: "absolute",
    right: 24,
    top: 24,
    width: 34,
    height: 34,
  },
  comment: {
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    marginBottom: 18,
    textAlign: "center",
  },
});
