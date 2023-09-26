import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ProfilePost } from "../Components/ProfilePost";
import { SvgAdd, SvgAdded, SvgLogOut } from "../images/Svg";
import { selectUser } from "../redux/auth/authSelectors";
import { fetchUserPosts } from "../redux/posts/postsOperations";
import { selectUserPosts } from "../redux/posts/postsSelectors";

export const ProfileScreen = () => {
  const navigation = useNavigation();

  const { name, avatar, uid } = useSelector(selectUser);

  const dispatch = useDispatch();

  const posts = useSelector(selectUserPosts);

  useEffect(() => {
    dispatch(fetchUserPosts(uid));
  }, [uid]);

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
          {avatar ? (
            <>
              <Image source={{ uri: `${avatar}` }} style={styles.avatarImage} />
              <TouchableOpacity
                style={styles.addButton}
                // onPress={deleteAvatar}
              >
                <SvgAdded />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              // onPress={addAvatar}
            >
              <SvgAdd />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.userName}>{name}</Text>
        <View style={styles.allPostsWrapper}>
          <ScrollView contentContainerStyle={styles.scroll}>
            {posts.map((post) => (
              <ProfilePost
                key={post.id}
                image={{ uri: post.photo }}
                title={post.title}
                comentQuantity={0} //додати логіку
                location={post.location}
                likes={153} //додати логіку
              />
            ))}
          </ScrollView>
        </View>
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
  },
  scroll: {
    paddingLeft: 16,
    paddingRight: 16,
  },
});
