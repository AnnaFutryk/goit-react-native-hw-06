import { useState } from "react";
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

  const [isFocusedInput, setIsFocusedInput] = useState(false);
  const [comment, setComment] = useState("");

  const SubmitComent = ({ comment }) => {
    setComment(comment);
    console.log(comment);
    setComment("");
    reset();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "position" : "height"}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Image style={styles.img} source={require("../images/sunset.png")} />
          <View style={styles.commentWrapper}>
            <Comment
              avatar={require("../images/comment-ava.png")}
              text={
                "Really love your most recent photo. I've been trying to capture the same thing for a few months and would love some tips!"
              }
              date={"09 червня, 2020 | 08:40"}
            />
            <Comment
              style={{ flexDirection: "row-reverse", textAlign: "left" }}
              avatar={require("../images/avatar.jpg")}
              text={
                "A fast 50mm like f1.8 would help with the bokeh. I’ve been using primes as they tend to get a bit sharper images."
              }
              date={"09 червня, 2020 | 09:14"}
            />
            <Comment
              avatar={require("../images/comment-ava.png")}
              text={"Thank you! That was very helpful!"}
              date={"09 червня, 2020 | 09:20"}
            />
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
                  onPress={handleSubmit(SubmitComent)}
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
