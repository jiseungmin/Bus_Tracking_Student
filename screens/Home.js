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
  Dimensions,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
const { width, height } = Dimensions.get("window"); // Get the screen width

const Home = ({ navigation }) => {
  const [notification, setNotification] = useState(false);
  const [Title, setTitle] = useState("");
  const notificationListener = useRef();
  const [Content, setContent] = useState("");
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // 각 항목을 클릭했을 때 호출될 함수들
  const goToScreen = (screenName) => {
    navigation.navigate("Map", { screenName });
  };
  const goToTimeTable = (screenName) => {
    navigation.navigate("TimeTable", { screenName });
  };

  const internetchecking = async () => {
    try {
      const response = await fetch(
        "https://bus-tracking-server-mu.vercel.app/api/notice",
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setTitle(data.title);
      setContent(data.content);
      setLoading(false); // 데이터 로드 완료 후 로딩 상태 false로 설정
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textStyle}>SMUBUS</Text>
        <View style={styles.card}>
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color="#244092" />
            </View>
          ) : (
            <>
              <Text style={styles.noticeTitle}>{Title}</Text>
              <Text style={styles.noticeContent}>{Content}</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.contentContainer}>
        <ImageBackground
          source={require('../assets/roadf.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.buttonWrapper}>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.btncontainer}
                onPress={() => goToScreen("CheonanTerminalStation")}
              >
                <Text style={styles.item}>천안{"\n"}터미널</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btncontainer}
                onPress={() => goToScreen("CheonanStation")}
              >
                <Text style={styles.item}>천안역</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btncontainer}
                onPress={() => goToScreen("CheonanAsanStation")}
              >
                <Text style={styles.item}>천안{"\n"}아산역</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.btncontainer}
                onPress={() => goToScreen("OnyangOncheonStation")}
              >
                <Text style={styles.item}>온양{"\n"}온천역</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btncontainer}
                onPress={() => goToScreen("CheonanCampus")}
              >
                <Text style={styles.item}>천안{"\n"}캠퍼스</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btncontainer}
                onPress={() => goToTimeTable("TimeTable")}
              >
                <Text style={styles.item}>시간표{"\n"}바로가기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    backgroundColor: "#244092",
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    marginTop: -5,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 60,
  },
  btncontainer: {
    width: "28%", // Use percentage for responsive design
    height: 60, // Fixed height for uniformity
    borderRadius: 10, // Slightly rounded corners
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    fontSize: 18,
    fontWeight: "500",
    fontWeight: "bold",
    textAlign: "center",
  },
  textStyle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  noticeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  noticeContent: {
    fontSize: 20,
    color: "#666",
    textAlign: "center",
  },
});

export default Home;