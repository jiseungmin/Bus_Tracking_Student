import React, { useRef, useState, useEffect } from "react";
import { Button, Image } from "react-native";
import registerForPushNotifications from "../notification/registerForPushNotifications"
import { WebView } from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
const { width, height } = Dimensions.get('window');

const busInfo = {
  route: '노선명 천안터미널',
  time: '운행 시간 9:30~10:00~10:30',
  number: '차량 번호 77사 7973',
  busNumber: '11'
};

const Stage = ({ route, navigation }) => {  
  const location  = route.params.screenName
  const webViewRef = useRef(null);
  const source = require("../assets/tmap.html");
  const webviewSource = Image.resolveAssetSource(source);
  const intervalRef = useRef(null);
  const notificationListener = useRef();
  const [notification, setNotification] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("버스 추적 하기");

  const goback  = () => {
    navigation.navigate("Home");
  }

  useEffect(() => {
    // 권한 허가 후  TOKEN 값 받기
    registerForPushNotifications();

    // 알림 수신 리스너
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
  }, []);

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
          JSON.stringify({ latitude: latitude, longitude: longitude })
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleTracking = () => {
    if (isTracking) {
      // 인터벌 정지
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsTracking(false);
      setButtonTitle("버스 추적하기");
    } else {
      // 인터벌 시작
      intervalRef.current = setInterval(fetchLocation, 1000); // 10초
      setIsTracking(true);
      setButtonTitle("버스 추적 진행중");
    }
  };

  return (
    
    <View style={styles.container}>
       {/* 웹뷰 위에 플로팅 뒤로 가기 버튼 */}
      <TouchableOpacity onPress={goback} style={styles.floatingButton}>
        <Image
          source={require('../assets/backgo.png')} // 뒤로 가기 아이콘 이미지 경로
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
      <TouchableOpacity onPress={toggleTracking} style={styles.button}>
        <Text style={styles.buttonText}>{buttonTitle}</Text>
      </TouchableOpacity>

      {/* 사용자 지정 뷰 */}
      <View style={styles.infoContainer}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../assets/bus.png')} // 버스 아이콘 이미지 경로
            style={styles.busIcon}
          />
          <Text style={styles.busOrder}>{`차량 순서 ${busInfo.busNumber}`}</Text>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webView: {
    height: height * 0.6, // WebView 높이, 필요에 따라 조절 가능
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  customView: {
    flexDirection: 'row', // 자식 요소들을 가로로 배치합니다.
    alignItems: 'center', // 가로축(세로 방향)을 중앙에 맞춥니다.
    justifyContent: 'space-between', // 양 끝에 요소들을 배치합니다.
    padding: 20, // 내부 여백
    borderTopWidth: 1, // 위쪽 테두리
    borderColor: '#ccc', // 테두리 색상
  },
  busInfoText: {
    fontSize: 16, // 글꼴 크기
    marginBottom: 5, // 텍스트 간의 여백
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busOrder: {
    fontSize: 16,
    // 텍스트를 중앙 정렬합니다.
    textAlign: 'center',
    marginTop: 5, // 아이콘과의 거리를 설정합니다.
  },
  busIcon: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  textContainer: {
    marginLeft: 10,
  },
  routeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 16,
  },
  numberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // 차량 번호와 버스 번호를 화면 너비에 맞춰 분산시킵니다.
  },
  numberText: {
    fontSize: 16,
  },
  busNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute', // 뷰 상에서 절대적인 위치
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