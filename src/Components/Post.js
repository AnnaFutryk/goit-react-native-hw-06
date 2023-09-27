import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { SvgComent, SvgLocation } from "../images/Svg";
import { selectPost } from "../redux/posts/postsSlice";

export const Post = ({ image, title, comentQuantity, location, postId }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handlePostSelection = () => {
    dispatch(selectPost({ postId: postId, postImage: image.uri }));

    navigation.navigate("Comments", { postImage: image.uri, postId: postId });
  };

  return (
    <View style={styles.postWrapper}>
      <Image style={styles.postImage} source={image} />
      <Text style={styles.postTitle}>{title}</Text>
      <View style={styles.postDetails}>
        <TouchableOpacity
          style={styles.commentBlock}
          onPress={handlePostSelection}
        >
          <SvgComent style={styles.postSvg} />
          <Text style={styles.postsQuantity}>{comentQuantity}</Text>
        </TouchableOpacity>
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
    color: "#BDBDBD",
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
});
