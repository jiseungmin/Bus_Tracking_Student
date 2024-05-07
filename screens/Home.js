import React, { useState, useEffect } from "react";
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
  ImageBackground
} from "react-native";

const { width, height } = Dimensions.get('window'); // Get the screen width


const Home = ({ navigation }) => {
  const [notification, setNotification] = useState(false);
  const [name, setName] = useState("");

  // 각 항목을 클릭했을 때 호출될 함수들
  const goToScreen = (screenName) => {
    navigation.navigate("Map", { screenName });
  };

  const internetchecking = async () => {
    try {
      const response = await fetch(
        "https://6635b167415f4e1a5e252583.mockapi.io/test/name"
      );
      const data = await response.json();
      const names = data.map((item) => item.name);
      setName(names[0]); // 첫 번째 이름 값을 저장
      return names;
    } catch (error) {
      setName("error"); // 첫 번째 이름 값을 저장
      console.error("Error fetching data:", error);

      return []; // 오류 발생 시 빈 배열 반환
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
          <Text style={styles.noticeTitle}>공지사항</Text>
          <Text style={styles.noticeContent}>{name}</Text>
        </View>
      </View>
      
      <ImageBackground
        source={require('../assets/roadf.png')}
        resizeMode="contain"
        style={styles.contentContainer}>
        <TouchableOpacity 
          style={styles.btncontainer}
          onPress={() => goToScreen("Cheonan_Terminal")}>
          <Text style={styles.item}>천안{"\n"}터미널</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btncontainer}
          onPress={() => goToScreen("Cheonan_Station")}>
          <Text style={styles.item}>천안역</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btncontainer}
          onPress={() => goToScreen("Cheonan_Asan_Station")}>
          <Text style={styles.item}>천안{"\n"}아산역</Text>
        </TouchableOpacity>
      </ImageBackground>
      <ImageBackground
        source={require('../assets/roadf.png')}
        resizeMode="contain" 
        style={styles.contentContainer}>
        <TouchableOpacity 
          style={styles.btncontainer}
          onPress={() => goToScreen("Onyang_Oncheon_Station")}>
          <Text style={styles.item}> 온양온천역{"\n"}(아산터미널)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btncontainer}
          onPress={() => goToScreen("Cheonan_Campus")}>
          <Text style={styles.item}>천안{"\n"}캠퍼스</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btncontainer}
          onPress={() => goToScreen("Screen2")}>
          <Text style={styles.item}> 시간표{"\n"}바로가기</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  header: {
    flex:1,
    backgroundColor: "#244092",
    width: '100%', 
    alignItems: 'center',
    padding: 15,
  },
  contentContainer: {
    flex: 2,
    width: '100%',
    backgroundColor: "#f4f4f4",
    flexDirection: "row",
    justifyContent: 'space-around', // 요소간 간격을 space-around로 변경하여 균등 배분
    alignItems: 'center', // 모든 자식 요소를 세로 방향 가운데로 정렬
    //padding: 15, // 패딩 조정
  },
  btncontainer: {
    width: width * 0.28, // 버튼 크기 조정
    height: height * 0.08,
    borderRadius: 8, // 테두리 반경 조정
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    fontSize: 18, // 폰트 크기 조정
    fontWeight: "500", // 폰트 두께 조정
    textAlign: "center"
  },
  textStyle: {
    color: "#fff",
    fontSize: 24, // 텍스트 크기 조정
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginTop:20,
    width: "90%", // 카드의 너비를 늘려 콘텐츠가 더 잘 보이게 함
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333", // 텍스트 색상 조정
  },
  noticeContent: {
    fontSize: 16,
    color: "#666", // 텍스트 색상을 더 진하게 조정
    textAlign: "center",
  },
});


export default Home;
