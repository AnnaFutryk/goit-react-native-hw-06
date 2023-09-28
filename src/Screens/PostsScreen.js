import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../redux/auth/authSelectors";
import { Post } from "../Components/Post";
import { selectUserPosts } from "../redux/posts/postsSelectors";
import { useEffect, useState } from "react";
import { fetchUserPosts } from "../redux/posts/postsOperations";
import { fetchUserComments } from "../redux/comments/commentsOperations";

export const PostsScreen = () => {
  const { name, avatar, email, uid } = useSelector(selectUser);

  const [postId, setPostId] = useState("");

  const dispatch = useDispatch();

  const comments = useSelector((store) => store.comments.comments);
  console.log("коменти з постскрін: ", comments);

  const posts = useSelector(selectUserPosts);
  const selectedPostImage = useSelector(
    (state) => state.posts.selectedPostImage
  );

  useEffect(() => {
    dispatch(fetchUserComments({ postId, uid }));
    setPostId(postId);
  }, [uid, postId]);

  useEffect(() => {
    dispatch(fetchUserPosts(uid));
  }, [uid]);

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
          {posts.map((post) => (
            <Post
              key={post.id}
              image={{ uri: post.photo }}
              title={post.title}
              commentQuantity={
                comments.filter((comment) => comment.postId === post.id).length
              }
              location={post.location}
              selectedPostImage={selectedPostImage}
              postId={post.id}
              setPostId={setPostId}
            />
          ))}
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
