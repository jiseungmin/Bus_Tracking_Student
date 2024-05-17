import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width; // 창의 너비를 가져옵니다.
const windowHeight = Dimensions.get("window").height; // 창의 높이를 가져옵니다.

const Splash = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Home");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/splash_v3.png")}
        style={styles.imageStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textStyle: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold", 
  },
  imageStyle: {
    width: windowWidth, 
    height: windowHeight, 
    resizeMode: "cover",
  },
});

export default Splash;
