import React, { useRef, useState, useEffect } from "react";
import { Button, Image } from "react-native";
import registerForPushNotifications from "../notification/registerForPushNotifications";
import { WebView } from "react-native-webview";
import * as Notifications from "expo-notifications";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
const { width, height } = Dimensions.get("window");

const busInfo = {
  route: "노선명 천안터미널",
  time: "운행 시간 9:30~10:00~10:30",
  number: "차량 번호 77사 7973",
  busNumber: "11",
};

const Stage = ({ route, navigation }) => {
  const webViewRef = useRef(null);
  const notificationListener = useRef();
  const [notification, setNotification] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("현재 버스 위치 확인");

  const Station = route.params.screenName;
  const StationFileMap = {
    Cheonan_Terminal: require("../assets/tmap_Cheonan_Terminal.html"),
    Cheonan_Station: require("../assets/tmap_Cheonan_Station.html"),
    Cheonan_Asan_Station: require("../assets/tmap_Cheonan_Asan_Station.html"),
    Onyang_Oncheon_Station: require("../assets/tmap_Onyang_Oncheon_Station.html"),
    Cheonan_Campus: require("../assets/tmap_Cheonan_Campus.html"),
  };
  const source = StationFileMap[Station];
  const webviewSource = Image.resolveAssetSource(source);

  useEffect(() => {
    // 권한 허가 후  TOKEN 값 받기
    registerForPushNotifications();

    // 알림 수신 리스너
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
  }, []);

  /* 함수 */
  const goback = () => {
    navigation.navigate("Home");
  };

  // 서버에서 셔틀버스 위도 경도 가져오기
  const fetchLocation = async () => {
    const serverUrl =
      "https://bus-tracking-server-mu.vercel.app/api/read?filePath=data.json";
    try {
      const response = await fetch(serverUrl, { method: "GET" });

      const data = await response.json();
      let contentObj = JSON.parse(data.content);
      let latitude = contentObj.latitude;
      let longitude = contentObj.longitude;

      console.log(latitude);
      console.log(longitude);

      // WebView로 위치 정보 전송
      if (webViewRef.current) {
        webViewRef.current.postMessage(
          JSON.stringify({
            latitude: latitude,
            longitude: longitude,
          })
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 웹뷰 위에 플로팅 뒤로 가기 버튼 */}
      <TouchableOpacity onPress={goback} style={styles.floatingButton}>
        <Image
          source={require("../assets/backgo.png")} // 뒤로 가기 아이콘 이미지 경로
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* 지도를 표시하는 WebView 컴포넌트 */}
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={webviewSource}
        style={styles.webView}
      />

      {/* 추적 토글 버튼 */}
      <TouchableOpacity onPress={fetchLocation} style={styles.button}>
        <Text style={styles.buttonText}>{buttonTitle}</Text>
      </TouchableOpacity>

      {/* 사용자 지정 뷰 */}
      <View style={styles.infoContainer}>
        <View>
          <Image
            source={require("../assets/bus.png")} // 버스 아이콘 이미지 경로
            style={styles.busIcon}
          />
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

export default Stage;
