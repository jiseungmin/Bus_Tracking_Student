import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import registerForPushNotifications from "../notification/registerForPushNotifications";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from "react-native";

const Home = ({ navigation }) => {
  const [notification, setNotification] = useState(false);

  // 각 항목을 클릭했을 때 호출될 함수들
  const goToScreen = (screenName) => {
    navigation.navigate("Map", { screenName });
  };

  useEffect(() => {
    // 알림 권한 허가 후  TOKEN 값 받기
    registerForPushNotifications();

    let { status } = Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("위치 정보 접근 권한이 거부되었습니다.");
      return;
    }

    // 알림 수신 리스너
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    return () => backHandler.remove(); // 컴포넌트 해제 시 이벤트 리스너 제거
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>SMUBUS</Text>

      <TouchableOpacity onPress={() => goToScreen("Cheonan_Terminal")}>
        <Text style={styles.item}>천안터미널</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => goToScreen("Cheonan_Station")}>
        <Text style={styles.item}>천안역</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => goToScreen("Cheonan_Asan_Station")}>
        <Text style={styles.item}>천안아산역</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => goToScreen("Onyang_Oncheon_Station")}>
        <Text style={styles.item}>온양온천역/아산터미널</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => goToScreen("Cheonan_Campus")}>
        <Text style={styles.item}>천안캠퍼스</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => goToScreen("Screen2")}>
        <Text style={styles.item}>시간표 바로가기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 40,
  },
  item: {
    fontSize: 20,
    marginBottom: 20,
  },
  textStyle: {
    color: "black",
    marginBottom: 50,
    fontSize: 36,
    fontWeight: "bold", // 텍스트의 두께를 조절합니다.
  },
});

export default Home;
