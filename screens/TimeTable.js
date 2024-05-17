import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  ScrollView,
  Image
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


const TimeTable = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState("평일");
  const [selectedStation, setSelectedStation] = useState("CheonanTerminalStation");
  const [selectedSemester, setSelectedSemester] = useState("학기");


  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const response_json = await response.json();
      const fetchedData = response_json.schedules[selectedStation];
      console.log("fetchedData: ", fetchedData)

      await AsyncStorage.setItem(
        `${selectedSemester}_${selectedDay}_${selectedStation}`,
        JSON.stringify(fetchedData)
      );
      setData(fetchedData);
      setError(null);
    } catch (error) {
     // loadLocalData()
      console.error("Error fetching data: ", error);
      setError(error.message);
    }
  };


  const TimeTableData = () => {
    setData([]); 
    let base_url = "https://bus-tracking-server-mu.vercel.app/api";
    let semester_path = selectedSemester === "학기" ? "semester" : "vacation";
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

    const url = `${base_url}/${semester_path}/${day_path}?key=${selectedStation}`;
    console.log(`semester_path: ${semester_path} day_path: ${day_path} station:${selectedStation} `)
    console.log("Fetching data from URL:", url);
    fetchData(url);
  };

  //2. 내부 저장소도 핸들링  --  x  (Web작동이라 내부 저장소 의미가 없음. 일단은 구현은 해놓음) 
  const loadLocalData = async () => {
    try {
      const localData = await AsyncStorage.getItem(
        `${selectedSemester}_${selectedDay}_${selectedStation}`
      );
      if (localData !== null) {
        setData(JSON.parse(localData));
        setError(null);
        console.log("Loaded data from AsyncStorage:", localData);
      } else {
        setError("No local data available");
      }
    } catch (error) {
      console.error("Error loading local data: ", error);
      setError(error.message);
    }
  };

  const stations = [
    { label: "천안역", key: "CheonanStation" },
    { label: "아산(KTX)역", key: "CheonanAsanStation" },
    { label: "천안터미널", key: "CheonanTerminalStation" },
    { label: "온양역/터미널", key: "OnyangOncheonStation" },
    { label: "천안캠퍼스", key: "CheonanCampus" },
  ];

  const filteredStations = () => {
    if (selectedSemester === "방학" && selectedDay === "평일") {
      return stations.filter(station => 
        station.key === "CheonanAsanStation" || 
        station.key === "CheonanTerminalStation" || 
        station.key === "OnyangOncheonStation"
      );
    } else if (selectedDay === "토요일/공휴일" || selectedDay === "일요일") {
      return stations.filter(station => 
        station.key === "CheonanAsanStation" || 
        station.key === "CheonanTerminalStation"
      );
    } else {
      return stations;
    }
  };

  const renderItem = (item) => {
      switch (selectedStation) {
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
          if(selectedSemester === "방학" ){
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
          }
          else if (selectedDay === "토요일/공휴일" || selectedDay === "일요일") {
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
          }  else {
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
          if (selectedSemester === "방학") {
            return (
              <View key={item._id} style={styles.itemContainer}>
                <Text style={styles.itemText}>순서: {item.scheduleId}</Text>
                <Text style={styles.itemText}>아산 캠퍼스 출발: {item.AsanCampusDeparture}</Text>
                <Text style={styles.itemText}>천안 터미널 도착: {item.Terminal}</Text>
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
          if (selectedSemester === "방학" && selectedDay === "평일") {
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
          } else {
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
          return (
            <View key={item._id} style={styles.itemContainer}>
              <Text style={styles.itemText}>순서: {item.scheduleId}</Text>
              <Text style={styles.itemText}>아산 캠퍼스 출발: {item.AsanCampusDeparture}</Text>
              <Text style={styles.itemText}>천안 캠퍼스 도착: {item.CheonanCampusStop}</Text>
              <Text style={styles.itemText}>아산 캠퍼스 도착: {item.AsanCampusArrival}</Text>
              <Text style={styles.itemText}>금요일 운행 여부: {item.isFridayDriving ? "운행" : "운행 X"}</Text>
            </View>
          );
        default:
          return null;
      }
    };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
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
        <Text style={styles.title}>SMU BUS</Text>
      </View>

      <View style={styles.buttonRow}>
        {["학기", "방학"].map((semester) => (
          <TouchableOpacity
            key={semester}
            style={[
              styles.touchButton,
              selectedSemester === semester && styles.selectedButton,
            ]}
            onPress={() => {
              setSelectedSemester(semester)
              setData([])
            }}
          >
            <Text style={styles.buttonText}>{semester}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonRow}>
        {["평일", "토요일/공휴일", "일요일"].map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.touchButton,
              selectedDay === day && styles.selectedButton,
            ]}
            onPress={() => {setSelectedDay(day)
              setData([])
            }}
            
          >
            <Text style={styles.buttonText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonRow}>
        {filteredStations().map((station) => (
          <TouchableOpacity
            key={station.key}
            style={[
              styles.touchButton,
              selectedStation === station.key && styles.selectedButton,
            ]}
            onPress={() => {setSelectedStation(station.key)
              setData([]); 
            }}
          >
            <Text style={styles.buttonText}>{station.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.errorText}>Error: {error}</Text>}


      <ScrollView style={styles.scrollView}>
        <View>
          {data.map((item) => renderItem(item))}
        </View>
      </ScrollView>
      <Button onPress={TimeTableData} title="event"></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20,
  },
  itemContainer: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  scrollView: {
    height: 500,
    marginTop: 20,
    overflow: 'scroll'
  },
  itemText: {
    fontSize: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 이미지와 텍스트를 좌우로 배치
    marginBottom: 20,
  },
  floatingButton: {
    marginRight: 10, // 텍스트와 이미지 사이의 간격 조정
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  textStyle: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  selectedButton: {
    backgroundColor: "#A4A4A4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  imageStyle: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
});

export default TimeTable;
