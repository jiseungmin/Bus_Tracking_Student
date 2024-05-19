import React, { useEffect } from "react";
import Navigation from './Navigation';

export default function App() {

  useEffect(() => {
    // 서비스 워커 등록
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
            subscribeUserToPush(registration);
          }).catch(error => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  // 푸시 알림 구독 함수
  const subscribeUserToPush = async (registration) => {
    if ('PushManager' in window) {
      try {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.EXPO_PUBLIC_VAPID_KEY)
        });
        console.log('User is subscribed:', subscription);

        // 서버에 구독 정보를 저장합니다.
        await fetch('http://localhost:3000/api/subscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Failed to subscribe the user: ', error);
      }
    }
  };

  // VAPID 키 변환 함수
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return (
    <Navigation/>
  );
}
