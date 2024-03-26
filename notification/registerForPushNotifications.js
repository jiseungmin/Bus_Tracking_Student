// registerForPushNotifications.js
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native'; // Platform 모듈 추가

const PUSH_ENDPOINT = 'http://192.168.0.8:3000/api/token';

const registerForPushNotificationsAsync = async () => {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

   // 푸시 알림 권한 요청
   const { status: existingStatus } = await Notifications.getPermissionsAsync();
   let finalStatus = existingStatus;
   if (existingStatus !== 'granted') {
     const { status } = await Notifications.requestPermissionsAsync();
     finalStatus = status;
   }
 
   // 권한이 거부된 경우 처리
   if (finalStatus !== 'granted') {
     alert('Failed to get push token for push notification!');
     return;
   }

   token = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig.extra.eas.projectId,
  });
  console.log("tokne: ", token);


 return fetch(PUSH_ENDPOINT, {
  method: 'POST',
headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
},
 body: JSON.stringify({
token: {
 value: token,
 },
 }),
 });
};

export default registerForPushNotificationsAsync;
