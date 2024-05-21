import React, { useRef, useState, useEffect } from "react";
import { Alert, Image, Platform, Modal, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import * as Notifications from "expo-notifications";
import { fetchBusLocation } from "../API/api";
import Timetable from "../TimeTable/TimeTable";
import { fetchTimetableData } from '../TimeTable/fetchTimetableData';
import { StationFileMap } from "../config/stations";

// Notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Map = ({ route, navigation }) => {
  const webViewRef = useRef(null);
  const [data, setData] = useState([]);
  const notificationListener = useRef();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState("평일");
  const [notification, setNotification] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState("학기");
  const [buttonTitle, setButtonTitle] = useState("현재 버스 위치 확인");

  const [busInfo, setBusInfo] = useState({
    allBuses: [],
    busorder: "",
    station: "",
    bustime: "",
    busnumber: ""
  });

  const StationNameMap = {
    CheonanTerminalStation: "천안터미널",
    CheonanStation: "천안역",
    CheonanAsanStation: "천안아산역",
    OnyangOncheonStation: "온양온천역(아산터미널)",
    CheonanCampus: "천안캠퍼스",
  };

  const Station = route.params.screenName;
  const webviewSource = Platform.OS === "web" ? `./tmap_${Station}.html` : StationFileMap[Station].uri;

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    if (!modalVisible) {
      fetchData(); // Fetch data when the modal is opened
    }
  };

  const toggleInfoModal = () => {
    setInfoModalVisible(!infoModalVisible);
  };

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });
    fetchLocation();
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedSchedule, selectedDay]);

  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setData([]);
    const { data, error } = await fetchTimetableData(selectedSchedule, selectedDay, Station);
    
    setData(data);
    setError(error);
    setLoading(false);
  };

  const fetchLocation = async () => {
    if (isButtonDisabled) {
      Alert.alert("잠시만 기다려주세요.", "3초 후에 다시 시도할 수 있습니다.", [{ text: "확인" }]);
      return;
    }
    setIsButtonDisabled(true);
    try {
      const { contentObj } = await fetchBusLocation(Station);
      console.log("contentObj: ", contentObj);
      
      if (contentObj.length > 0) {
        const firstBus = contentObj[0];
        setBusInfo({
          allBuses: contentObj,
          busorder: contentObj.map(bus => bus.busorder).join(", "),
          station: firstBus.station,
          bustime: firstBus.BusTime,
          busnumber: firstBus.busNumber,
        });
        
        const User_latitude = 36.7980889;
        const User_longitude = 127.0817586;
        const { latitude, longitude } = firstBus;
        
        if (Platform.OS === "web") {
          window.frames[0].postMessage(
            JSON.stringify({  buses: contentObj, User_latitude, User_longitude }),
            "*"
          );
        } else {
          if (webViewRef.current) {
            webViewRef.current.postMessage(
              JSON.stringify({ latitude, longitude, User_latitude, User_longitude })
            );
          }
        }
      }else {
        setBusInfo({
          allBuses: [],
          busorder: "",
          station: "",
          bustime: "",
          busnumber: ""
        });
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
          <Text style={styles.boldText}>{StationNameMap[Station]}</Text>
        </View>
        <View style={styles.textContainer}>
    {busInfo.allBuses.length > 0 ? (
      <>
        <View style={styles.row}>
          <Text style={styles.mediumText}>{`현재 운행중인 차량 순서: ${busInfo.busorder}`}</Text>
          <TouchableOpacity onPress={toggleInfoModal} style={styles.inlineButton}>
            <Text style={styles.inlineButtonText}>상세 정보</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.mediumText}>운행 시간: {busInfo.bustime}</Text>
          <Text style={styles.mediumText}>차량 번호: {busInfo.busnumber}</Text>
        </View>
      </>
    ) : (
      <Text style={styles.mediumText}>운행 중인 버스 없음</Text>
    )}
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
      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewContent}>
          <Timetable
            loading={loading}
            error={error}
            data={data}
            Station={Station}
            selectedSchedule={selectedSchedule}
            selectedDay={selectedDay}
            styles={styles}
          />
        </View>
      </ScrollView>
      <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>닫기</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      <Modal animationType="slide" transparent={true} visible={infoModalVisible} onRequestClose={toggleInfoModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>버스 상세 정보</Text>
            <ScrollView style={styles.scrollView}>
              {busInfo.allBuses.map((bus, index) => (
                <View key={index} style={styles.busInfoContainer}>
                  <Text style={styles.mediumText}>{`배차 순서: ${bus.busorder}`}</Text>
                  <Text style={styles.mediumText}>{`운행 시간: ${bus.BusTime}`}</Text>
                  <Text style={styles.mediumText}>{`차량 번호: ${bus.busNumber}`}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={toggleInfoModal} style={styles.closeButton}>
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
    backgroundColor: "#fff",
  },
  webView: {
    flex: 1,
  },
  button: {
    backgroundColor: "#244092",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  inlineButton: {
    backgroundColor: "#244092",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  inlineButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
    marginLeft: 30,
  },
  floatingButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 10,
    left: 10,
    zIndex: 10,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  imgContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  busIcon: {
    width: 55,
    height: 55,
    marginBottom: 10,
  },
  boldText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 5,
  },
  busInfoContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  busInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  label: {
    fontSize: 18,
    color: "#555",
    fontWeight: "bold",
  },
  value: {
    fontSize: 18,
    color: "#555",
  },
  itemContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  mediumText: {
    marginBottom: 3,
    fontSize: 20,
    color: "#444",
  },
  numberContainer: {
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    height: "80%",
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
    width: "100%",
  },
  scrollViewContent: {
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
  },
});

export default Map;
