import React, { useState, useEffect, useRef } from "react";
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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Home = ({ navigation }) => {
  const [notification, setNotification] = useState(false);
  const [Title, setTitle] = useState("");
  const notificationListener = useRef();
  const [Content, setContent] = useState("");

  // 각 항목을 클릭했을 때 호출될 함수들
  const goToScreen = (screenName) => {
    navigation.navigate("Map", { screenName });
  };

  const internetchecking = async () => {
    try {
      const response = await fetch(
        "https://bus-tracking-server-mu.vercel.app/api/notice"
      );

      const data = await response.json();
      setTitle(data.title);
      setContent(data.content);
    } catch (error) {
      console.error("Error fetching data:", error);

      return [];
    }
  };

  useEffect(() => {
    internetchecking();
    // 알림 권한 허가 후  TOKEN 값 받기
    registerForPushNotifications();

    let { status } = Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
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

      <View style={styles.card}>
        <Text style={styles.noticeTitle}>{Title}</Text>
        <Text style={styles.noticeContent}>{Content}</Text>
      </View>

      <TouchableOpacity onPress={() => registerForPushNotifications()}>
        <Text style={styles.item}>토큰생성</Text>
      </TouchableOpacity>

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
    marginBottom: 20,
    fontSize: 36,
    fontWeight: "bold", // 텍스트의 두께를 조절합니다.
  },
  noticeContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#EAEAEA",
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    width: "80%",
    alignItems: "center",
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#555",
  },
  noticeContent: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
});

export default Home;
