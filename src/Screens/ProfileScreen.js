import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ProfilePost } from "../Components/ProfilePost";
import { SvgAdded, SvgLogOut } from "../images/Svg";
import {
  selectUserAvatar,
  selectUserId,
  selectUserName,
} from "../redux/auth/authSelectors";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  FIREBASE_AUTH,
  FIRESTORE_DB,
  FIRESTORE_STORAGE,
} from "../firebase/config";
import { updateUserProfile } from "../redux/auth/authOperations";

import { Ionicons } from "@expo/vector-icons";
import { updateNewAvatarUrl } from "../redux/auth/authSlice";
import { updateProfile } from "firebase/auth";

export const ProfileScreen = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const name = useSelector(selectUserName);
  const avatar = useSelector(selectUserAvatar);
  const userId = useSelector(selectUserId);

  const [updatedAvatar, setUpdatedAvatar] = useState("");
  const [changeAvatar, setChangeAvatar] = useState(false);

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const postsCollection = collection(FIRESTORE_DB, "posts");
    const userQuery = query(
      postsCollection,
      where("owner.userId", "==", userId)
    );
    onSnapshot(userQuery, (data) => {
      const userPosts = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const sortedUserPosts = userPosts.sort(
        (a, b) => b.createdAt - a.createdAt
      );
      setUserPosts(sortedUserPosts);
    });
  }, [userId]);

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
          setUpdatedAvatar(result.assets[0].uri);
          setChangeAvatar(true);
        }
      }
    } catch (error) {
      console.log("error", error.message);
    }
  };

  const addAvatarToFireBase = async () => {
    if (updatedAvatar) {
      try {
        const response = await fetch(updatedAvatar);
        const file = await response.blob();
        const imageRef = ref(FIRESTORE_STORAGE, `avatars/${userId}`);
        await uploadBytes(imageRef, file);

        const processedPhoto = await getDownloadURL(imageRef);

        // Оновити аватар в Firebase Auth
        await updateProfile(FIREBASE_AUTH.currentUser, {
          photoURL: processedPhoto,
        });

        // Оновити профіль користувача в Firestore
        await updateUserProfile(userId, processedPhoto);

        // Оновити аватарку в Redux Store
        dispatch(updateNewAvatarUrl(processedPhoto));

        // setUpdatedAvatar(processedPhoto)
        setChangeAvatar(false);
      } catch (error) {
        console.error(
          "Помилка при завантаженні або оновленні аватара: ",
          error
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../images/bg-photo.png")}
        style={styles.imageBackground}
        imageStyle={{}}
      >
        <View style={styles.profileWrapper}>
          <TouchableOpacity
            style={styles.logOutBtn}
            onPress={() => navigation.navigate("Login")}
          >
            <SvgLogOut />
          </TouchableOpacity>
        </View>
        <View style={styles.avatar}>
          <Image
            source={
              updatedAvatar ? { uri: updatedAvatar } : avatar && { uri: avatar }
            }
            style={styles.avatarImage}
          />
          {changeAvatar && (
            <TouchableOpacity onPress={addAvatarToFireBase}>
              <Ionicons
                style={styles.checkBtn}
                name="checkmark-circle"
                size={36}
                color={"#FF6C00"}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.addButton} onPress={pickImage}>
            <SvgAdded />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{name}</Text>
        {userPosts.length !== 0 ? (
          <FlatList
            data={userPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProfilePost
                id={item.id}
                title={item.title}
                photoLocation={item.photoLocation}
                url={item.photo}
                geolocation={item.geolocation}
              />
            )}
            style={styles.allPostsWrapper}
          />
        ) : (
          <View style={{ flex: 1, marginTop: 30, paddingHorizontal: 16 }}>
            <Text style={styles.text}>Зробіть першу публікацію</Text>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    position: "relative",
    minHeight: 812,
  },
  profileWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    top: 140,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  logOutBtn: {
    position: "absolute",
    top: 22,
    right: 16,
  },
  avatar: {
    position: "relative",
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    marginBottom: 32,
    width: 120,
    aspectRatio: 1,
    marginTop: 76,
    marginLeft: "auto",
    marginRight: "auto",
  },
  avatarImage: {
    borderRadius: 16,
    width: 120,
    height: 120,
  },
  checkBtn: {
    position: "absolute",
    right: 100,
    bottom: 0,
  },
  addButton: {
    position: "absolute",
    width: 44,
    height: 44,
    right: -24,
    bottom: 0,
  },
  userName: {
    fontSize: 30,
    lineHeight: 35,
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    marginBottom: 32,
  },
  allPostsWrapper: {
    flex: 1,
    position: "relative",
    marginBottom: 43,
    paddingLeft: 16,
    paddingRight: 16,
  },
  text: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    textAlign: "center",
  },
});
