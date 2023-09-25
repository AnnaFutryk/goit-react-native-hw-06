import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/auth/authSelectors";
import { Post } from "../Components/Post";

export const PostsScreen = () => {
  const { name, avatar, email } = useSelector(selectUser);

  return (
    <View style={styles.wrapper}>
      <View style={styles.userInfo}>
        <View style={styles.avaWrapper}>
          {avatar && (
            <Image style={styles.userAvatar} source={{ uri: `${avatar}` }} />
          )}
        </View>

        <View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
      </View>
      <View style={styles.allPostsWrapper}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Post
            image={require("../images/forest.png")}
            title={"Ліс"}
            comentQuantity={0}
            location={"Ivano-Frankivs'k Region, Ukraine"}
          />
          <Post
            image={require("../images/sunset.png")}
            title={"Захід на Чорному морі"}
            comentQuantity={0}
            location={"Ukraine"}
          />
          <Post
            image={require("../images/house.png")}
            title={"Старий будиночок у Венеції"}
            comentQuantity={0}
            location={"Italy"}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    marginTop: 32,
    marginBottom: 32,
  },
  avaWrapper: {
    borderRadius: 16,
    width: 60,
    height: 60,
    marginRight: 8,
    backgroundColor: "#F6F6F6",
  },
  userAvatar: {
    borderRadius: 16,
    width: 60,
    height: 60,
    marginRight: 8,
  },
  userName: {
    lineHeight: 15,
    fontFamily: "Roboto-Bold",
    fontSize: 13,
  },
  userEmail: {
    lineHeight: 13,
    fontFamily: "Roboto-Regular",
    fontSize: 11,
  },
  allPostsWrapper: {
    flex: 1,
    position: "relative",
  },
  scroll: {
    paddingLeft: 16,
    paddingRight: 16,
  },
});
