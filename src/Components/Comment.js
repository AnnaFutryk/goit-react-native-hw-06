import moment from "moment";
import "moment/locale/uk";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { selectUpdatedAvatar } from "../redux/auth/authSelectors";

export const Comment = ({ comment, owner, createdAt, style }) => {
  const updatedAvatar = useSelector(selectUpdatedAvatar);

  return (
    <View style={styles.wrapper}>
      <View style={styles.commentsBlock}>
        <View style={[styles.commentItem, style]}>
          <Image
            style={styles.commentAva}
            source={
              owner.avatar ? { uri: owner.avatar } : { uri: updatedAvatar }
            }
          />
          <View style={styles.commentTxtPart}>
            <Text style={styles.text}>{comment}</Text>
            <Text style={styles.date}>
              {moment(createdAt).locale("uk").format("DD MMMM, YYYY | HH:mm")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 31,
  },

  commentsBlock: {
    gap: 24,
  },
  commentItem: {
    gap: 16,
    flexDirection: "row",
    width: "100%",
  },
  commentAva: {
    width: 28,
    height: 28,
    borderRadius: 50,
  },
  commentTxtPart: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.03)",
    padding: 16,
    borderEndEndRadius: 6,
    borderTopRightRadius: 6,
  },
  text: {
    fontFamily: "Roboto-Regular",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  date: {
    fontSize: 10,
    lineHeight: 11,
    fontFamily: "Roboto-Regular",
    textAlign: "right",
    color: "#BDBDBD",
  },
});
