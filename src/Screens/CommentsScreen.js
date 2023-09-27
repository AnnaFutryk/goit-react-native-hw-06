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
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../redux/auth/authSelectors";
import { selectUserComments } from "../redux/comments/commentsSelectors";
import {
  fetchAddedComment,
  fetchUserComments,
} from "../redux/comments/commentsOperations";
import { useRoute } from "@react-navigation/native";

const schema = yup.object().shape({
  comment: yup.string().required("Введіть коментар"),
});

export const CommentsScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { avatar, uid } = useSelector(selectUser);

  const route = useRoute();
  const { postImage, postId } = route.params;

  // const { selectedPostImage, selectedPostId } = useSelector(
  //   (store) => store.posts
  // );

  const comments = useSelector(
    (store) => selectUserComments(store, postId) // Передаємо postId для фільтрації коментарів
  );

  // const postImage = useSelector((store) => store.posts.posts[0]?.photo);
  // console.log(postImage);//не пішло

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserComments({ postId, uid }));
  }, [uid, postId]);

  const [isFocusedInput, setIsFocusedInput] = useState(false);
  const [comment, setComment] = useState("");

  const SubmitComment = () => {
    dispatch(fetchAddedComment({ comment, uid, postId }));
    setComment("");
    reset();
  };

  console.log("Comments:", comments);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "position" : "height"}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Image style={styles.img} source={{ uri: postImage }} />

          <View style={styles.commentWrapper}>
            {comments.map((commentData) => (
              <Comment
                key={commentData.id}
                avatar={{ uri: avatar }}
                text={commentData.comment}
                date={commentData.date}
              />
            ))}
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
});
