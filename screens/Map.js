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
  route: "천안터미널",
  number: "77사 7973",
  time: "9:30~10:00~10:30",
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
          source={require("../assets/icon_back2.png")}
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
        <View style={styles.imgContainer}>
          <Image
            source={require("../assets/icon_bus.png")}
            style={styles.busIcon}
          />
          <Text
            style={styles.smallText}
          >{`차량 순서 ${busInfo.busNumber}`}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.boldText}>노선명 {busInfo.route}</Text>
          <Text style={styles.mediumText}>운행 시간 : {busInfo.time}</Text>
          <View style={styles.numberContainer}>
            <Text style={styles.mediumText}>차량 번호 : {busInfo.number}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // 밝은 회색 톤의 배경색
  },
  webView: {
    width: width, // 화면 너비에 맞게 조정
    height: height, // 전체 높이의 60%를 차지
  },
  button: {
    backgroundColor: "#244092", // iOS 스타일의 기본 파란색
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20, // 좌우 마진 추가
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF", // 텍스트 색상을 흰색으로
    fontWeight: "bold",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 30, // 좌우 패딩 추가
    paddingVertical: 30, // 상하 패딩 추가
    backgroundColor: "#FFFFFF", // 백그라운드를 흰색으로 설정
    shadowColor: "#000", // 그림자 색상
    shadowOffset: { width: 0, height: 1 }, // 그림자 위치
    shadowOpacity: 0.2, // 그림자 투명도
    shadowRadius: 1.41, // 그림자 반경
    elevation: 2, // 안드로이드용 그림자
  },
  textContainer: {
    flex: 1, // 남은 공간 모두 차지
    marginLeft: 30,
  },
  floatingButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 10, // 플랫폼에 따라 상단 여백 조정
    left: 10,
    zIndex: 10,
  },
  backIcon: {
    width: 40, // 아이콘 크기 조정
    height: 40,
  },
  imgContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  busIcon: {
    width: 55, // 아이콘 크기 조정
    height: 55,
    marginBottom: 10,
  },
  boldText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 5,
  },
  mediumText: {
    fontSize: 20,
    color: "#444",
  },
  smallText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  }
});

export default Map;
