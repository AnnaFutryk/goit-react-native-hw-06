import { useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SvgAdd, SvgAdded, SvgCamera } from "../images/Svg";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../redux/auth/authOperations";
import { selectIsLoading } from "../redux/auth/authSelectors";
// import { updateUserAvatar } from "../redux/auth/authOperations";
// import { FIRESTORE_STORAGE } from "../firebase/config";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const [type, setType] = useState(Camera.Constants.Type.back);

  const [isLoginFocused, setIsLoginFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");

  const [visiblePassword, setVisiblePassword] = useState(false);

  const loading = useSelector(selectIsLoading);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      setHasPermission(status === "granted");
      if (hasPermission === null) {
        return <View />;
      }
      if (hasPermission === false) {
        return <Text>No access to camera</Text>;
      }
    })();
  }, []);

  const addAvatar = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync();
      setAvatar(uri);
      setShowCamera(false);
    }
  };

  // const addAvatarToFirebase = async () => {
  //   const postId = Date.now().toString();
  //   if (avatar) {
  //     try {
  //       const response = await fetch(avatar);
  //       const file = await response.blob();
  //       const storageRef = ref(FIRESTORE_STORAGE, `avatars/${postId}`);
  //       await uploadBytes(storageRef, file);

  //       const processedPhoto = await getDownloadURL(storageRef);
  //       return processedPhoto;
  //     } catch (error) {
  //       console.error("Помилка завантаження аватара на Firebase: ", error);
  //     }
  //   }
  // };

  const showPassword = () => {
    setVisiblePassword(!visiblePassword);
  };

  const signUpUser = async () => {
    // const newAvatarUrl = await addAvatarToFirebase();
    const registrationData = { login, email, password, avatar };
    dispatch(signUp(registrationData)).then((response) => {
      response.type === "firebase/signUp/fulfilled" &&
        navigation.navigate("Home", { screen: "PostsScreen" });
    });
    setLogin("");
    setEmail("");
    setPassword("");
    setAvatar("");
    reset();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#FF6C00" />
          <Text style={styles.registrationTitle}>Loading...</Text>
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
            <View style={styles.avatar}>
              {showCamera ? (
                <Camera
                  style={styles.avatarImage}
                  type={type}
                  ref={setCameraRef}
                >
                  <TouchableOpacity
                    style={styles.changeCameraType}
                    onPress={() => {
                      setType(
                        type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back
                      );
                    }}
                  />
                  <TouchableOpacity
                    style={styles.addPhotoBtn}
                    onPress={addAvatar}
                  >
                    <SvgCamera />
                  </TouchableOpacity>
                </Camera>
              ) : (
                <>
                  {avatar ? (
                    <>
                      <Image
                        style={styles.previewPhotoContainer}
                        source={{ uri: avatar }}
                      />
                      <TouchableOpacity
                        onPress={() => setAvatar("")}
                        style={styles.addedButton}
                      >
                        <SvgAdded />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => setShowCamera(true)}
                    >
                      <SvgAdd />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>

            <Text style={styles.registrationTitle}>Реєстрація</Text>
            <View style={styles.formWrapper}>
              {errors.login && <Text>{errors.login.message}</Text>}
              <Controller
                control={control}
                name="login"
                render={({ field }) => (
                  <TextInput
                    style={[
                      styles.input,
                      isLoginFocused && styles.inputFocused,
                    ]}
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

          <View style={styles.BtnWrap}>
            <TouchableOpacity
              style={styles.registrationButton}
              onPress={handleSubmit(signUpUser)}
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
      )}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  loading: {
    marginTop: 100,
    marginBottom: 20,
  },
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
  changeCameraType: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
    flex: 1,
    width: "100%",
    borderRadius: 16,
  },
  previewPhotoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  addPhotoBtn: {
    position: "absolute",
    width: 44,
    height: 44,
    right: 35,
    top: 35,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  addButton: {
    position: "absolute",
    width: 44,
    height: 44,
    right: -30,
    bottom: 0,
  },
  addedButton: {
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
