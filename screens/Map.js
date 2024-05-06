import { Alert, Image, Platform } from "react-native";
import { fetchBusLocation } from "../API/api";
import { WebView } from "react-native-webview";
import { StationFileMap } from "../config/stations";
import * as Notifications from "expo-notifications";
import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

/* TODO 운전자 앱에서 버스 정보및 시간표 데이터 받기 */
const busInfo = {
  busNumber: "11",
  route: "노선명 천안터미널",
  number: "차량 번호 77사 7973",
  time: "운행 시간 9:30~10:00~10:30",
};

/* 알림 처리 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Map = ({ route, navigation }) => {
  const webViewRef = useRef(null);
  const notificationListener = useRef();
  const [notification, setNotification] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("현재 버스 위치 확인");

  const Station = route.params.screenName;
  const webviewSource = Image.resolveAssetSource(StationFileMap[Station]);

  const htmlPath =
    Platform.OS === "ios"
      ? { uri: `file:///android_asset/tmap_${Station}.html` }
      : webviewSource;

  /* useEffect */
  useEffect(() => {
    // 알림 수신 리스너
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
  }, []);

  /* 버스 위치 트래킹 함수 */
  const fetchLocation = async () => {
    if (isButtonDisabled) {
      Alert.alert("잠시만 기다려주세요.", "3초 후에 다시 시도할 수 있습니다.", [
        { text: "확인" },
      ]);
      return;
    }
    setIsButtonDisabled(true);
    try {
      const { latitude, longitude, userLocation } = await fetchBusLocation();

      /* TODO 임의로 유저의 위도 경도 설정 해놓음 나중에 수정 */
      const User_latitude = 36.7988;
      const User_longitude = 127.077;

      // WebView로 위치 정보 전송
      if (webViewRef.current) {
        webViewRef.current.postMessage(
          JSON.stringify({
            latitude: latitude,
            longitude: longitude,
            User_latitude: User_latitude,
            User_longitude: User_longitude,
          })
        );
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      {/* 웹뷰 위에 플로팅 뒤로 가기 버튼 */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Home");
        }}
        style={styles.floatingButton}
      >
        <Image
          source={require("../assets/backgo.png")}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* 지도를 표시하는 WebView 컴포넌트 */}
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={htmlPath}
        style={styles.webView}
      />

      {/* 추적 토글 버튼 */}
      <TouchableOpacity onPress={fetchLocation} style={styles.button}>
        <Text style={styles.buttonText}>{buttonTitle}</Text>
      </TouchableOpacity>

      {/* 사용자 지정 뷰 */}
      <View style={styles.infoContainer}>
        <View>
          <Image source={require("../assets/bus.png")} style={styles.busIcon} />
          <Text
            style={styles.busOrder}
          >{`차량 순서 ${busInfo.busNumber}`}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.routeText}>{busInfo.route}</Text>
          <Text style={styles.timeText}>{busInfo.time}</Text>
          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>{busInfo.number}</Text>
            <Text style={styles.busNumber}>{busInfo.busNumber}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webView: {
    height: height * 0.6, // WebView 높이, 필요에 따라 조절 가능
  },
  button: {
    backgroundColor: "#38B63C",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  infoContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  busOrder: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },
  busIcon: {
    width: 100,
    height: 50,
    resizeMode: "contain",
  },
  textContainer: {
    marginLeft: 10,
  },
  routeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 16,
  },
  numberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%", // 차량 번호와 버스 번호를 화면 너비에 맞춰 분산시킵니다.
  },
  numberText: {
    fontSize: 16,
  },
  busNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute", // 뷰 상에서 절대적인 위치
    top: 44, // 안전한 상단 여백으로 설정 (상태바 등을 고려)
    left: 10, // 화면 왼쪽에서의 위치
    zIndex: 10, // 다른 요소들 위에 렌더링되도록 zIndex 설정
  },
  backIcon: {
    width: 30, // 아이콘의 너비
    height: 30, // 아이콘의 높이
  },
});

export default Map;
