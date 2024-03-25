import React, { useRef, useState, useEffect } from "react";
import { Asset } from "expo-asset";
import { Image } from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const DriveButton = ({ onFetchLocation }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onFetchLocation}>
      <Text style={styles.buttonText}>위치 정보 받기</Text>
    </TouchableOpacity>
  );
};

export default function App() {
  const webViewRef = useRef(null);
  const source = require("./assets/tmap.html");
  const webviewSource = Image.resolveAssetSource(source);

  const intervalRef = useRef(null);
  const [locationData, setLocationData] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("버스 추적 하기");

  // 메시지를 받았을 때 실행될 함수
  const handleOnMessage = (event) => {
    const message = event.nativeEvent.data;
    console.log(message);
  };

  

  const fetchLocation = async () => {
    const serverUrl =
      "https://bus-tracking-server-mu.vercel.app/api/read?filePath=data.json";
    try {
      const response = await fetch(serverUrl, {
        method: "GET",
      });

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
      intervalRef.current = setInterval(fetchLocation, 1000); // 15초마다 실행
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
        onMessage={handleOnMessage} // 메시지 수신 핸들러
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
    flex: 1, // WebView를 전체 화면으로 설정
  },
  button: {
    position: "absolute", // 버튼을 WebView 위에 위치시킵니다.
    bottom: 20, // 하단에서 20px 떨어진 위치에
    left: 20, // 왼쪽에서 20px 떨어진 위치에
    right: 20, // 오른쪽에서 20px 떨어진 위치에
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center", // 버튼 내부 텍스트를 가운데 정렬합니다.
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
