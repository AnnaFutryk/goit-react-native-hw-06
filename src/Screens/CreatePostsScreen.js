import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import * as Location from "expo-location";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import {
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { SvgCamera, SvgLocation, SvgTrash } from "../images/Svg";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectUserId, selectUserName } from "../redux/auth/authSelectors";
import { FIRESTORE_DB, FIRESTORE_STORAGE } from "../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

const schema = yup.object().shape({
  title: yup.string().required("Введіть назву публікації"),
  photoLocation: yup.string(),
});

export const CreatePostsScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigation = useNavigation();

  const name = useSelector(selectUserName);
  const userId = useSelector(selectUserId);

  const [photo, setPhoto] = useState("");
  const [title, setTitle] = useState("");
  const [photoLocation, setPhotoLocation] = useState("");
  const [geolocation, setGeolocation] = useState("");

  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [submitButtonActive, setSubmitButtonActive] = useState(false);
  const [isFocusedInput, setIsFocusedInput] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isValid && photo) {
      setSubmitButtonActive(true);
    } else {
      setSubmitButtonActive(false);
    }
  }, [isValid, photo]);

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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setGeolocation(coords);
    })();
  }, []);

  const addPhoto = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync();
      setPhoto(uri);
    }
  };

  const resetForm = () => {
    setTitle("");
    setPhotoLocation("");
    setPhoto("");
    setGeolocation("");
    reset();
  };

  const addPhotoToFireBase = async () => {
    const postId = Date.now().toString();
    console.log(postId);

    try {
      const blob = await fetch(photo).then((response) => response.blob());
      const imageRef = ref(FIRESTORE_STORAGE, `postImage/${postId}`);

      await uploadBytes(imageRef, blob);

      const processedPhoto = await getDownloadURL(imageRef);

      return processedPhoto;
    } catch (error) {
      console.log("Помилка при завантаженні фото:", error.message);
      return null;
    }
  };

  const addPostToFireBase = async () => {
    setLoading(true);
    try {
      const photo = await addPhotoToFireBase();
      await addDoc(collection(FIRESTORE_DB, "posts"), {
        photo,
        title,
        photoLocation,
        geolocation,
        owner: { userId, name },
        createdAt: new Date().getTime(),
      });
    } catch (error) {
      console.log("error", error.message);
      throw error;
    } finally {
      setLoading(false);
      resetForm();
      navigation.navigate("PostsScreen");
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled) {
          setPhoto(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.log("error", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screenContainer}>
        <View style={styles.wrapper}>
          <View style={styles.contentImgBlock}>
            <View style={styles.imageWrapper}>
              <Camera style={styles.camera} type={type} ref={setCameraRef}>
                <TouchableOpacity
                  style={styles.changeCameraType}
                  onPress={() => {
                    setType(
                      type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    );
                  }}
                >
                  <TouchableOpacity
                    style={styles.addPhotoBtn}
                    activeOpacity={0.7}
                    onPress={addPhoto}
                  >
                    <SvgCamera width={24} height={24} />
                  </TouchableOpacity>
                  {photo && (
                    <Image
                      style={styles.previewPhotoContainer}
                      source={{ uri: photo }}
                    />
                  )}
                </TouchableOpacity>
              </Camera>
            </View>
            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.text}>
                {!photo ? "Завантажте фото" : "Редагувати фото"}
              </Text>
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "position" : "height"}
            keyboardVerticalOffset={80}
          >
            <View>
              <View style={styles.inputWrapper}>
                {errors.title && <Text>{errors.title.message}</Text>}
                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <TextInput
                      style={[
                        styles.input,
                        isFocusedInput && styles.inputFocused,
                      ]}
                      placeholder="Назва..."
                      value={title}
                      onChangeText={(value) => {
                        setTitle(value);
                        field.onChange(value);
                      }}
                      onFocus={() => setIsFocusedInput(true)}
                      onBlur={() => setIsFocusedInput(false)}
                    />
                  )}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Controller
                  control={control}
                  name="location"
                  render={({ field }) => (
                    <>
                      <SvgLocation
                        width={24}
                        height={24}
                        style={styles.locationSvg}
                      />
                      <TextInput
                        style={[
                          styles.locationInput,
                          isFocusedInput && styles.inputFocused,
                        ]}
                        value={photoLocation}
                        placeholder="Місцевість"
                        onChangeText={(value) => {
                          setPhotoLocation(value);
                          field.onChange(value);
                        }}
                        onFocus={() => setIsFocusedInput(true)}
                        onBlur={() => setIsFocusedInput(false)}
                      />
                    </>
                  )}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.submitBtn,
              !submitButtonActive && styles.submitBtnDisable,
              loading && styles.submitBtnDisable,
            ]}
            onPress={handleSubmit(addPostToFireBase)}
            disabled={!submitButtonActive || loading}
          >
            {loading ? (
              <Text style={[styles.btnTitle, styles.btnTitleDisable]}>
                Завантаження...
              </Text>
            ) : (
              <Text
                style={[
                  styles.btnTitle,
                  !submitButtonActive && styles.btnTitleDisable,
                ]}
              >
                Опублікувати
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={resetForm}>
            <SvgTrash width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "#fff",
    minHeight: 812,
  },
  wrapper: {
    flex: 1,
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 34 + 83,
    marginRight: "auto",
    marginLeft: "auto",
  },
  contentImgBlock: { marginBottom: 32 },
  imageWrapper: {
    width: 343,
    height: 240,
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  changeCameraType: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotoBtn: {
    width: 60,
    height: 60,
    padding: 18,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  previewPhotoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  text: {
    fontFamily: "Roboto-Regular",
    color: "#BDBDBD",
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
    borderStyle: "solid",
    paddingBottom: 15,
    paddingTop: 16,
    marginBottom: 16,
  },
  inputFocused: {
    color: "#212121",
  },
  locationSvg: {
    position: "absolute",
    top: "50%",
    left: 0,
    width: 24,
    height: 24,
    marginTop: -13,
  },
  locationInput: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    minWidth: 343,
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
    borderStyle: "solid",
    paddingLeft: 28,
    paddingBottom: 15,
    paddingTop: 16,
  },
  submitBtnDisable: {
    backgroundColor: "#F6F6F6",
    borderRadius: 100,
    minWidth: 343,
    padding: 16,
    marginTop: 27,
  },
  submitBtn: {
    backgroundColor: "#FF6C00",
    color: "#fff",
    borderRadius: 100,
    minWidth: 343,
    padding: 16,
    marginTop: 27,
  },
  btnTitleDisable: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    color: "#BDBDBD",
  },
  btnTitle: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    color: "#fff",
  },
  deleteBtn: {
    width: 70,
    borderRadius: 20,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 23,
    paddingRight: 23,
    backgroundColor: "#F6F6F6",
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: 120,
  },
});
