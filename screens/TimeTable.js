import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  ScrollView,
} from "react-native";
import WebView from "react-native-web-webview";

const TimeTable = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [station, setStation] = useState("CheonanTerminalStation");
  const [error, setError] = useState(null);

  const TimeTableData = async () => {
    try {
      const response = await fetch(
        `https://bus-tracking-server-mu.vercel.app/api/semester/A_weekdays?key=${station}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const response_json = await response.json();
      const fetchedData = response_json.schedules[station];
      setData(fetchedData);
      setError(null);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  //const StationTable = async () => {
  // try {
  //   if(station === "CheonanTerminalStation"){

  // }else if {

  // }
  //} catch (error) {}
  //};

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>SMU BUS</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.touchButton}>
          <Text style={styles.buttonText}>평일</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchButton}>
          <Text style={styles.buttonText}>토요일/공휴일</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchButton}>
          <Text style={styles.buttonText}>일요일</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.touchButton}
          onPress={() => {
            setData("CheonanStation");
          }}
        >
          <Text style={styles.buttonText}>천안역</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchButton}
          onPress={() => {
            setData("CheonanAsanStation");
          }}
        >
          <Text style={styles.buttonText}>아산(KTX)역</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchButton}
          onPress={() => {
            setData("CheonanTerminalStation");
          }}
        >
          <Text style={styles.buttonText}>천안터미널</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchButton}
          onPress={() => {
            setData("OnyangOncheonStation");
          }}
        >
          <Text style={styles.buttonText}>온양역/터미널</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchButton}
          onPress={() => {
            setData("CheonanCampus");
          }}
        >
          <Text style={styles.buttonText}>천안캠퍼스</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>Error: {error}</Text>}

      <ScrollView style={styles.scrollView}>
        {data.map((item, index) => (
          <View key={`${item._id}-${index}`} style={styles.itemContainer}>
            <Text style={styles.itemText}>순서: {item.scheduleId}</Text>
            <Text style={styles.itemText}>
              아산 캠퍼스 출발: {item.AsanCampusDeparture}
            </Text>

            <Text style={styles.itemText}>
              천안 터미널 도착: {item.TerminalArrival}
            </Text>
            <Text style={styles.itemText}>
              아산 캠퍼스 도착: {item.AsanCampusArrival}
            </Text>

            <Text style={styles.itemText}>
              금요일 운행 여부: {item.isFridayDriving ? "운행" : "운행 X"}
            </Text>
          </View>
        ))}
      </ScrollView>
      <Button onPress={TimeTableData} title="event"></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  scrollView: {
    marginTop: 20,
  },
  itemText: {
    fontSize: 16,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  textStyle: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
