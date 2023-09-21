import { useNavigation } from "@react-navigation/native";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ProfilePost } from "../Components/ProfilePost";
import { SvgAdd, SvgLogOut } from "../images/Svg";

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const addAvatar = (event) => {
    event.preventDefault();
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
            source={require("../images/avatar.jpg")}
            style={styles.avatarImage}
          />
          <TouchableOpacity style={styles.addButton} onPress={addAvatar}>
            <SvgAdd />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>Natali Romanova</Text>
        <View style={styles.allPostsWrapper}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <ProfilePost
              image={require("../images/forest.png")}
              title={"Ліс"}
              comentQuantity={8}
              location={"Ukraine"}
              likes={153}
            />
            <ProfilePost
              image={require("../images/sunset.png")}
              title={"Захід на Чорному морі"}
              comentQuantity={3}
              location={"Ukraine"}
              likes={200}
            />
            <ProfilePost
              image={require("../images/house.png")}
              title={"Старий будиночок у Венеції"}
              comentQuantity={50}
              location={"Italy"}
              likes={200}
            />
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
