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
    fontWeight: "bold", // 텍스트의 두께를 조절합니다.
  },
  imageStyle: {
    width: windowWidth, // 너비에 대해 유동적인 크기 조정
    height: windowHeight, // 높이에 대해 유동적인 크기 조정
    resizeMode: "cover",
  },
});

export default Splash;
