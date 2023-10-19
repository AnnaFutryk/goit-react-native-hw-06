import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FIRESTORE_DB } from "../firebase/config";
import { SvgComent, SvgCommentColor, SvgLocation } from "../images/Svg";

export const Post = ({ id, title, url, photoLocation, geolocation }) => {
  const navigation = useNavigation();

  const [comments, setComments] = useState([]);

  useEffect(() => {
    const commentsCollection = collection(
      FIRESTORE_DB,
      "posts",
      id,
      "comments"
    );
    onSnapshot(commentsCollection, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map((doc) => ({
        commentId: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    });
  }, []);

  return (
    <View style={styles.postWrapper}>
      <Image style={styles.postImage} source={{ uri: url }} />
      <Text style={styles.postTitle}>{title}</Text>
      <View style={styles.postDetails}>
        <TouchableOpacity
          style={styles.commentBlock}
          onPress={() => navigation.navigate("Comments", { url, id })}
        >
          {comments.length === 0 ? (
            <SvgComent style={styles.postSvg} />
          ) : (
            <SvgCommentColor style={styles.postSvg} />
          )}
          <Text style={styles.postsQuantity}>{comments.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.locationBlock}
          onPress={() =>
            navigation.navigate("Map", { geolocation, photoLocation })
          }
        >
          <SvgLocation style={styles.postSvg} />
          <Text style={styles.locationTxt}>{photoLocation}</Text>
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
