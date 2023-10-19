import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../redux/auth/authOperations";
import { selectIsLoading } from "../redux/auth/authSelectors";

const validationSchema = object().shape({
  email: string()
    .email("Невірний формат електронної пошти")
    .required("Email є обов'язковим полем"),
  password: string()
    .min(6, "Пароль повинен містити принаймні 6 символів")
    .required("Пароль є обов'язковим полем"),
});

export const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [visiblePassword, setVisiblePassword] = useState(false);

  const loading = useSelector(selectIsLoading);

  const showPassword = () => {
    setVisiblePassword(!visiblePassword);
  };

  const signInUser = () => {
    dispatch(signIn({ email, password })).then((response) => {
      response.type === "firebase/signIn/fulfilled" &&
        navigation.navigate("Home", { screen: "PostsScreen" });
    });
    setEmail("");
    setPassword("");
    reset();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#FF6C00" />
          <Text style={styles.loginTitle}>Loading...</Text>
        </View>
      ) : (
        <ImageBackground
          source={require("../images/bg-photo.png")}
          style={styles.imageBackground}
          imageStyle={{
            minHeight: 812,
          }}
        >
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <Text style={styles.loginTitle}>Увійти</Text>
            <View style={styles.formWrapper}>
              {errors.email && <Text>{errors.email.message}</Text>}
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <TextInput
                    style={[
                      styles.input,
                      isEmailFocused && styles.inputFocused,
                    ]}
                    placeholder="Адреса електронної пошти"
                    placeholderTextColor={"#BDBDBD"}
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      field.onChange(value);
                    }}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                  />
                )}
              />

              <View style={styles.lastInputWrapper}>
                {errors.password && <Text>{errors.password.message}</Text>}
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <TextInput
                      style={[
                        styles.input,
                        isPasswordFocused && styles.inputFocused,
                      ]}
                      placeholderTextColor={"#BDBDBD"}
                      placeholder="Пароль"
                      value={password}
                      secureTextEntry={!visiblePassword}
                      onChangeText={(value) => {
                        setPassword(value);
                        field.onChange(value);
                      }}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                    />
                  )}
                />
                <TouchableOpacity
                  style={styles.showPasswordButton}
                  onPress={showPassword}
                >
                  <Text style={styles.showPasswordText}>
                    {!visiblePassword ? "Показати" : "Приховати"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>

          <View style={styles.LoginBtnWrap}>
            <TouchableOpacity
              style={styles.registrationButton}
              onPress={handleSubmit(signInUser)}
            >
              <Text style={styles.registrationButtonText}>Увійти</Text>
            </TouchableOpacity>
            <View style={styles.registrationTextWrapper}>
              <Text style={styles.registrationLinkText}>Немає акаунту?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Registration")}
              >
                <Text style={styles.registrationLink}>Зареєструватися</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      )}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  loading: { marginTop: 100 },

  imageBackground: {
    flex: 1,
    position: "relative",
  },
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    minHeight: 489,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 32,
  },

  loginTitle: {
    marginTop: 32,
    marginBottom: 32,
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    lineHeight: 35,
    textAlign: "center",
  },
  formContainer: {
    position: "relative",
  },
  input: {
    color: "#BDBDBD",
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E8E8E8",
    borderRadius: 8,
    padding: 16,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    marginBottom: 16,
  },
  inputFocused: {
    borderColor: "#FF6C00",
    backgroundColor: "#fff",
    color: "#000",
  },
  showPasswordButton: {
    fontSize: 16,
  },
  lastInputWrapper: {
    position: "relative",
  },

  showPasswordText: {
    position: "absolute",
    top: -51,
    right: 16,
    color: "#1B4371",
  },
  LoginBtnWrap: {
    position: "absolute",
    width: "100%",
    top: 538 + 44,
    paddingLeft: 16,
    paddingRight: 16,
  },
  registrationButton: {
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    width: "100%",
    padding: 16,
    marginTop: 27,
    marginBottom: 16,
  },
  registrationButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
  },
  registrationTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: "auto",
    marginLeft: "auto",
    gap: 4,
  },
  registrationLinkText: {
    textAlign: "center",
    fontSize: 16,
    color: "#1B4371",
  },
  registrationLink: {
    fontSize: 16,
    color: "#1B4371",
    textDecorationLine: "underline",
  },
});
