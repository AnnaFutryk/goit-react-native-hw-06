import { collection, onSnapshot } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  RefreshControl,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../Components/Post";
import { FIRESTORE_DB, FIRESTORE_STORAGE } from "../firebase/config";
import {
  selectUpdatedAvatar,
  selectUser,
  selectUserAvatar,
  selectUserId,
  selectUserName,
} from "../redux/auth/authSelectors";

export const PostsScreen = () => {
  const dispatch = useDispatch();
  const name = useSelector(selectUserName);
  const { email } = useSelector(selectUser);
  const avatar = useSelector(selectUserAvatar);
  const updatedAvatar = useSelector(selectUpdatedAvatar);
  // const [updatedAvatar, setUpdatedAvatar] = useState(null);
  const newAvatarUrl = useSelector((store) => store.auth.newAvatarUrl);

  const userId = useSelector(selectUserId);

  const [postsCollection, setPostsCollection] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = () => {
    const postsRef = collection(FIRESTORE_DB, "posts");

    onSnapshot(postsRef, (querySnapshot) => {
      const postsData = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((post) => post.owner.userId === userId);

      const sortedPosts = postsData.sort((a, b) => b.createdAt - a.createdAt);
      setPostsCollection(sortedPosts);
    });
  };

  const getUpdatedAvatarUrl = async () => {
    const storageRef = ref(FIRESTORE_STORAGE, `avatars/${userId}`);
    try {
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Помилка при отриманні URL оновленої аватарки", error);
      return null;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
    setRefreshing(false);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.userInfo}>
        <View style={styles.avaWrapper}>
          {avatar ? (
            <Image style={styles.userAvatar} source={{ uri: avatar }} />
          ) : (
            <Image style={styles.userAvatar} source={{ uri: newAvatarUrl }} />
          )}
        </View>
        <View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
      </View>
      {postsCollection.length !== 0 && (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={postsCollection}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Post
              key={item.id}
              id={item.id}
              title={item.title}
              photoLocation={item.photoLocation}
              url={item.photo}
              geolocation={item.geolocation}
            />
          )}
          style={styles.allPostsWrapper}
        />
      )}
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
    paddingLeft: 16,
    paddingRight: 16,
  },
});
