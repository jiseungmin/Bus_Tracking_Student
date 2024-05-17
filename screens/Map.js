import { Alert, Image, Platform, Modal } from "react-native";
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
  ScrollView,
  ActivityIndicator,
} from "react-native";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState("학기");
  const [selectedDay, setSelectedDay] = useState("평일");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const Station = route.params.screenName;
  console.log(Station);
  console.log(`./assets/tmap_${Station}.html`);
  const webviewSource = Platform.OS === "web" ? `./assets/tmap_${Station}.html` : StationFileMap[Station].uri;

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    if (!modalVisible) {
      fetchTimetableData(); // Fetch data when the modal is opened
    }
  };

  useEffect(() => {
    // 알림 수신 리스너
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    fetchTimetableData();
  }, []);

  useEffect(() => {
    fetchTimetableData();
  }, [selectedSchedule, selectedDay]);

  const fetchLocation = async () => {
    if (isButtonDisabled) {
      Alert.alert("잠시만 기다려주세요.", "3초 후에 다시 시도할 수 있습니다.", [{ text: "확인" }]);
      return;
    }
    setIsButtonDisabled(true);
    try {
      const { latitude, longitude, userLocation } = await fetchBusLocation();

      /* TODO 임의로 유저의 위도 경도 설정 해놓음 나중에 수정 */
      const User_latitude = 36.7980889;
      const User_longitude = 127.0817586;

      if (Platform.OS === "web") {
        window.frames[0].postMessage(
          JSON.stringify({
            latitude,
            longitude,
            User_latitude,
            User_longitude,
          }),
          "*"
        );
      } else {
        if (webViewRef.current) {
          webViewRef.current.postMessage(
            JSON.stringify({
              latitude,
              longitude,
              User_latitude,
              User_longitude,
            })
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 3000);
    }
  };

  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  const fetchTimetableData = async () => {
    setLoading(true);
    setError(null);
    setData([]);

    let base_url = "https://bus-tracking-server-mu.vercel.app/api";
    let semester_path = selectedSchedule === "학기" ? "semester" : "vacation";
    let day_path = "";

    switch (selectedDay) {
      case "평일":
        day_path = "A_weekdays";
        break;
      case "토요일/공휴일":
        day_path = "A_holidays";
        break;
      case "일요일":
        day_path = "A_sundays";
        break;
      default:
        break;
    }

    const url = `${base_url}/${semester_path}/${day_path}?key=${Station}`;
    console.log(`Fetching data from URL: ${url}`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const response_json = await response.json();
      const fetchedData = response_json.schedules[Station];
      console.log(fetchedData);

      setData(fetchedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTimetable = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#244092" />;
    }

    if (error) {
      return <Text style={styles.errorText}>Error: {error}</Text>;
    }

    if (data.length === 0) {
      return <Text style={styles.noDataText}>No data available</Text>;
    }

    return data.map((item) => {
      switch (Station) {
        case "CheonanStation":
          return (
            <View key={item._id} style={styles.itemContainer}>
              <Text style={styles.itemText}>순서: {item.scheduleId}</Text>
              <Text style={styles.itemText}>아산 캠퍼스 출발: {item.AsanCampusDeparture}</Text>
              <Text style={styles.itemText}>천안역 도착: {item.StationArrival}</Text>
              <Text style={styles.itemText}>아산 캠퍼스 도착: {item.AsanCampusArrival}</Text>
              <Text style={styles.itemText}>금요일 운행 여부: {item.isFridayDriving ? "운행" : "운행 X"}</Text>
            </View>
          );
        case "CheonanAsanStation":
          if (selectedSchedule === "방학") {
            return (
              <View key={item._id} style={styles.itemContainer}>
                <Text style={styles.itemText}>순서: {item.scheduleId}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 출발: {item.AsanCampusDeparture}</Text>
                <Text style={styles.itemText}>천안아산역 도착: {item.CheonanAsanStationArrival}</Text>
                <Text style={styles.itemText}>천안역 도착: {item.CheonanStation}</Text>
                <Text style={styles.itemText}>천안아산역 도착: {item.CheonanAsanStationDeparture}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 도착: {item.AsanCampusArrival}</Text>
                <Text style={styles.itemText}>금요일 운행 여부: {item.isFridayDriving ? "운행" : "운행 X"}</Text>
              </View>
            );
          } else if (selectedDay === "토요일/공휴일" || selectedDay === "일요일") {
            return (
              <View key={item._id} style={styles.itemContainer}>
                <Text style={styles.itemText}>순서: {item.scheduleId}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 출발: {item.AsanCampusDeparture}</Text>
                <Text style={styles.itemText}>천안아산역 도착: {item.CheonanAsanStation_trans1}</Text>
                <Text style={styles.itemText}>천안역 도착: {item.CheonanStation}</Text>
                <Text style={styles.itemText}>천안아산역 도착: {item.CheonanAsanStation_trans2}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 도착: {item.AsanCampusArrival}</Text>
                <Text style={styles.itemText}>금요일 운행 여부: {item.isFridayDriving ? "운행" : "운행 X"}</Text>
              </View>
            );
          } else {
            return (
              <View key={item._id} style={styles.itemContainer}>
                <Text style={styles.itemText}>순서: {item.scheduleId}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 출발: {item.AsanCampusDeparture}</Text>
                <Text style={styles.itemText}>아산(KTX)역 도착: {item.CheonanTerminalStation}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 도착: {item.AsanCampusArrival}</Text>
                <Text style={styles.itemText}>금요일 운행 여부: {item.isFridayDriving ? "운행" : "운행 X"}</Text>
              </View>
            );
          }
        case "CheonanTerminalStation":
          if (selectedSchedule === "방학") {
            return (
              <View key={item._id} style={styles.itemContainer}>
                <Text style={styles.itemText}>순서: {item.scheduleId}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 출발: {item.AsanCampusDeparture}</Text>
                <Text style={styles.itemText}>천안 터미널 도착: {item.Terminal}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 도착: {item.AsanCampusArrival}</Text>
                <Text style={styles.itemText}>금요일 운행 여부: {item.isFridayDriving ? "운행" : "운행 X"}</Text>
              </View>
            );
          } else if (selectedDay === "토요일/공휴일" || selectedDay === "일요일") {
            return (
              <View key={item._id} style={styles.itemContainer}>
                <Text style={styles.itemText}>순서: {item.scheduleId}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 출발: {item.AsanCampusDeparture}</Text>
                <Text style={styles.itemText}>천안 터미널 도착: {item.TerminalArrival}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 도착: {item.AsanCampusArrival}</Text>
                <Text style={styles.itemText}>금요일 운행 여부: {item.isFridayDriving ? "운행" : "운행 X"}</Text>
              </View>
            );
          } else {
            return (
              <View key={item._id} style={styles.itemContainer}>
                <Text style={styles.itemText}>순서: {item.scheduleId}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 출발: {item.AsanCampusDeparture}</Text>
                <Text style={styles.itemText}>천안 터미널 도착: {item.TerminalArrival}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 도착: {item.AsanCampusArrival}</Text>
                <Text style={styles.itemText}>금요일 운행 여부: {item.isFridayDriving ? "운행" : "운행 X"}</Text>
              </View>
            );
          }
        case "OnyangOncheonStation":
          if (selectedSchedule === "방학" && selectedDay === "평일") {
            return (
              <View key={item._id} style={styles.itemContainer}>
                <Text style={styles.itemText}>순서: {item.scheduleId}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 출발: {item.AsanCampusDeparture}</Text>
                <Text style={styles.itemText}>온양 온천역 도착: {item.OnyangOncheonStation}</Text>
                <Text style={styles.itemText}>아산 터미널 도착: {item.AsanTerminal}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 도착: {item.AsanCampusArrival}</Text>
                <Text style={styles.itemText}>금요일 운행 여부: {item.isFridayDriving ? "운행" : "운행 X"}</Text>
              </View>
            );
          } else if (selectedDay === "평일") {
            return (
              <View key={item._id} style={styles.itemContainer}>
                <Text style={styles.itemText}>순서: {item.scheduleId}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 출발: {item.AsanCampusDeparture}</Text>
                <Text style={styles.itemText}>온양 온천역 도착: {item.OnyangOncheonStationStop}</Text>
                <Text style={styles.itemText}>아산 터미널 도착: {item.TerminalArrival}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 도착: {item.AsanCampusArrival}</Text>
                <Text style={styles.itemText}>금요일 운행 여부: {item.isFridayDriving ? "운행" : "운행 X"}</Text>
              </View>
            );
          }
        case "CheonanCampus":
          if (selectedDay === "평일") {
            return (
              <View key={item._id} style={styles.itemContainer}>
                <Text style={styles.itemText}>순서: {item.scheduleId}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 출발: {item.AsanCampusDeparture}</Text>
                <Text style={styles.itemText}>천안 캠퍼스 도착: {item.CheonanCampusStop}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 도착: {item.AsanCampusArrival}</Text>
                <Text style={styles.itemText}>금요일 운행 여부: {item.isFridayDriving ? "운행" : "운행 X"}</Text>
              </View>
            );
          }
        default:
          return null;
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.floatingButton}>
        <Image source={require("../assets/icon_back2.png")} style={styles.backIcon} />
      </TouchableOpacity>

      {Platform.OS === "web" ? (
        <iframe ref={webViewRef} src={webviewSource} style={styles.webView} title="Map" />
      ) : (
        <WebView ref={webViewRef} originWhitelist={["*"]} source={{ uri: webviewSource }} style={styles.webView} />
      )}

      <TouchableOpacity onPress={fetchLocation} style={styles.button}>
        <Text style={styles.buttonText}>{buttonTitle}</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <View style={styles.imgContainer}>
          <Image source={require("../assets/icon_bus.png")} style={styles.busIcon} />
          <Text style={styles.smallText}>{`차량 순서 ${busInfo.busNumber}`}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.boldText}>{busInfo.route}</Text>
          <Text style={styles.mediumText}>운행 시간 : {busInfo.time}</Text>
          <View style={styles.numberContainer}>
            <Text style={styles.mediumText}>차량 번호 : {busInfo.number}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={toggleModal} style={styles.button}>
          <Text style={styles.buttonText}>시간표 보기</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>운행 시간표</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.scheduleButton, selectedSchedule === "학기" && styles.selectedButton]}
                onPress={() => handleScheduleSelect("학기")}
              >
                <Text style={styles.buttonText}>학기</Text>
              </TouchableOpacity>
              {(Station !== "CheonanStation" && Station !== "CheonanCampus") && (
                <TouchableOpacity
                  style={[styles.scheduleButton, selectedSchedule === "방학" && styles.selectedButton]}
                  onPress={() => handleScheduleSelect("방학")}
                >
                  <Text style={styles.buttonText}>방학</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.buttonRow}>
              {Station === "CheonanAsanStation" || Station === "CheonanTerminalStation" ? (
                <>
                  <TouchableOpacity
                    style={[styles.dayButton, selectedDay === "평일" && styles.selectedButton]}
                    onPress={() => handleDaySelect("평일")}
                  >
                    <Text style={styles.buttonText}>평일</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.dayButton, selectedDay === "토요일/공휴일" && styles.selectedButton]}
                    onPress={() => handleDaySelect("토요일/공휴일")}
                  >
                    <Text style={styles.buttonText}>토요일/공휴일</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.dayButton, selectedDay === "일요일" && styles.selectedButton]}
                    onPress={() => handleDaySelect("일요일")}
                  >
                    <Text style={styles.buttonText}>일요일</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={[styles.dayButton, selectedDay === "평일" && styles.selectedButton]}
                  onPress={() => handleDaySelect("평일")}
                >
                  <Text style={styles.buttonText}>평일</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView style={styles.scrollView}>{renderTimetable()}</ScrollView>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // 밝은 회색 톤의 배경색
  },
  webView: {
    flex: 1, // 화면 높이의 일정 부분을 차지하도록 설정
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
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    height: "80%", // 모달 높이 설정
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#244092",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
  noDataText: {
    color: "#444",
    fontSize: 16,
    marginBottom: 10,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
    color: "#444",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  scheduleButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#244092",
    borderRadius: 5,
    alignItems: "center",
  },
  dayButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#244092",
    borderRadius: 5,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#112244",
  },
  scrollView: {
    width: "100%", // 스크롤뷰 너비를 전체로 설정
  },
});

export default Map;
