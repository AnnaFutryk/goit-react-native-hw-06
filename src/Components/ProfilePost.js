import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SvgLocation, SvgLike, SvgCommentColor } from "../images/Svg";

export const ProfilePost = ({
  image,
  title,
  comentQuantity,
  location,
  likes,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.postWrapper}>
      <Image style={styles.postImage} source={image} />
      <Text style={styles.postTitle}>{title}</Text>
      <View style={styles.postDetails}>
        <TouchableOpacity
          style={styles.commentBlock}
          onPress={() => navigation.navigate("Comments")}
        >
          <SvgCommentColor style={styles.postSvg} />
          <Text style={styles.postsQuantity}>{comentQuantity}</Text>
        </TouchableOpacity>
        <View style={styles.likesBlock}>
          <SvgLike style={styles.svgLike} />
          <Text style={styles.postsLikes}>{likes}</Text>
        </View>
        <TouchableOpacity
          style={styles.locationBlock}
          onPress={() => navigation.navigate("Map")}
        >
          <SvgLocation style={styles.postSvg} />
          <Text style={styles.locationTxt}>{location}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postWrapper: {
    marginBottom: 32,
  },
  postImage: {
    height: 240,
    borderRadius: 8,
    width: "100%",
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    lineHeight: 18,
    color: "#212121",
    marginBottom: 8,
  },
  postDetails: {
    flexDirection: "row",
    gap: 24,
  },
  commentBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  postSvg: {
    marginRight: 6,
  },
  postsQuantity: {
    fontSize: 16,
    lineHeight: 18,
    color: "#212121",
  },
  locationBlock: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
  },
  locationTxt: {
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
    textDecorationLine: "underline",
  },
  likesBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  svgLike: { marginRight: 6 },
});
