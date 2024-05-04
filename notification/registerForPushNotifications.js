// registerForPushNotifications.js
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

import { Alert, Platform } from "react-native"; // Platform 모듈 추가
import AsyncStorage from "@react-native-async-storage/async-storage";

//const PUSH_ENDPOINT = 'http://192.168.0.8:3000/api/token';
const PUSH_ENDPOINT = "https://bus-tracking-server-mu.vercel.app/api/token";

// 1. Push Notification Token 토큰 생성
const registerForPushNotificationsAsync = async () => {
  console.log("Registerin");
  const alreadyGranted = await AsyncStorage.getItem("notificationsGranted");

  if (alreadyGranted === "true") {
    // 이미 권한이 허가되었다면 이후 로직을 실행하지 않음
    Alert.alert("잠시만 기다려주세요.", "이미 권한 먹음.", [{ text: "확인" }]);
    console.log("already");
    return;
  }

  let token;

  // 1-1 Android 기종일시 알림 채널 설정 defalut
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  // 1-2 Notification 권한 요청
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // 권한이 거부된 경우 처리
  if (finalStatus === "granted") {
    token = await Notifications.getExpoPushTokenAsync();
    console.log("Token: ", token);
    // 권한이 허가되었다는 정보를 저장
    await AsyncStorage.setItem("notificationsGranted", "true");
  } else {
    console.log("Failed to get push token for push notification!");
  }

  token = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig.extra.eas.projectId,
  });
  console.log("tokne: ", token);
  Alert.alert("잠시만 기다려주세요.", token + "토큰생성", [{ text: "확인" }]);

  return fetch(PUSH_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: {
        value: token,
      },
    }),
  });
};

export default registerForPushNotificationsAsync;
