import React, { useRef, useState, useEffect } from "react";
import { Image } from "react-native";
import registerForPushNotifications from "./notification/registerForPushNotifications";
import { WebView } from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const webViewRef = useRef(null);
  const source = require("./assets/tmap.html");
  const webviewSource = Image.resolveAssetSource(source);
  const intervalRef = useRef(null);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [notification, setNotification] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("버스 추적 하기");

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
      <WebView
        ref={webViewRef}
        style={styles.webviewStyle}
        originWhitelist={["*"]}
        source={webviewSource}
      />
      <TouchableOpacity
        onPress={toggleTracking}
        style={{ backgroundColor: "blue", padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>{buttonTitle}</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  webviewStyle: {
    flex: 1,
  },
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
