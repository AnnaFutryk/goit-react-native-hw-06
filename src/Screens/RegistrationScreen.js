import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  View,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SvgAdd } from "../images/Svg";

const validationSchema = object().shape({
  login: string().required("Логін є обов'язковим полем"),
  email: string()
    .email("Невірний формат електронної пошти")
    .required("Email є обов'язковим полем"),
  password: string()
    .min(6, "Пароль повинен містити принаймні 6 символів")
    .required("Пароль є обов'язковим полем"),
});

export const RegistrationScreen = () => {
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [isLoginFocused, setIsLoginFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [visiblePassword, setVisiblePassword] = useState(false);

  const addAvatar = (e) => {
    e.preventDefault();
  };

  const showPassword = () => {
    setVisiblePassword(!visiblePassword);
  };

  const onSubmit = ({ email, login, password }) => {
    console.log({
      Login: login,
      Email: email,
      Password: password,
    });

    setLogin("");
    setEmail("");
    setPassword("");
    reset();

    navigation.navigate("Home", {
      screen: "PostsScreen",
      // params: {
      //   login: login,
      //   email: email,
      // },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          <View style={styles.avatar}>
            <Image
              source={require("../images/avatar.jpg")}
              style={styles.avatarImage}
            />
            <TouchableOpacity style={styles.addButton} onPress={addAvatar}>
              <SvgAdd />
            </TouchableOpacity>
          </View>
          <Text style={styles.registrationTitle}>Реєстрація</Text>
          <View style={styles.formWrapper}>
            {errors.login && <Text>{errors.login.message}</Text>}
            <Controller
              control={control}
              name="login"
              render={({ field }) => (
                <TextInput
                  style={[styles.input, isLoginFocused && styles.inputFocused]}
                  placeholder="Логін"
                  placeholderTextColor={"#BDBDBD"}
                  value={login}
                  onChangeText={(value) => {
                    setLogin(value);
                    field.onChange(value);
                  }}
                  onFocus={() => setIsLoginFocused(true)}
                  onBlur={() => setIsLoginFocused(false)}
                />
              )}
            />

            {errors.email && <Text>{errors.email.message}</Text>}
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextInput
                  style={[styles.input, isEmailFocused && styles.inputFocused]}
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
        <View style={styles.BtnWrap}>
          <TouchableOpacity
            style={styles.registrationButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.registrationButtonText}>Зареєструватися</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.registrationLinkText}>
              Вже є акаунт? Увійти
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    position: "relative",
  },
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    minHeight: 549,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 32,
  },
  avatar: {
    position: "relative",
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    marginBottom: 32,
    width: 120,
    aspectRatio: 1,
    marginTop: "-25%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  avatarImage: {
    borderRadius: 16,
    width: 120,
    height: 120,
  },
  addButton: {
    position: "absolute",
    width: 44,
    height: 44,
    right: -24,
    bottom: 0,
  },
  registrationTitle: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    lineHeight: 35,
    textAlign: "center",
    marginBottom: 32,
  },
  formWrapper: {
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
    marginBottom: 16,
  },
  showPasswordText: {
    position: "absolute",
    top: -51,
    right: 16,
    color: "#1B4371",
  },
  BtnWrap: {
    position: "absolute",
    width: "100%",
    bottom: 45 + 34,
    // top: 604 + 44,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 43,
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
  registrationLinkText: {
    textAlign: "center",
    fontSize: 16,
    color: "#1B4371",
  },
});
