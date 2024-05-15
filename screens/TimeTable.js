import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  ScrollView,
} from "react-native";

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
        <TouchableOpacity style={styles.touchButton}>
          <Text style={styles.buttonText}>천안역</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchButton}>
          <Text style={styles.buttonText}>아산(KTX)역</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchButton}>
          <Text style={styles.buttonText}>천안터미널</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchButton}>
          <Text style={styles.buttonText}>온양역/터미널</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchButton}>
          <Text style={styles.buttonText}>천안캠퍼스</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>Error: {error}</Text>}

      <ScrollView style={styles.scrollView}>
        {data.map((item, index) => (
          <View key={`${item._id}-${index}`} style={styles.itemContainer}>
            <Text style={styles.itemText}>Schedule ID: {item.scheduleId}</Text>
            <Text style={styles.itemText}>Status: {item.status}</Text>
            <Text style={styles.itemText}>
              Asan Campus Arrival: {item.AsanCampusArrival}
            </Text>
            <Text style={styles.itemText}>
              Asan Campus Departure: {item.AsanCampusDeparture}
            </Text>
            <Text style={styles.itemText}>
              Doojeong McDonalds Departure: {item.DoojeongMcDonaldsDeparture}
            </Text>
            <Text style={styles.itemText}>
              Home Mart EveryDay Departure: {item.HomeMartEveryDayDeparture}
            </Text>
            <Text style={styles.itemText}>
              Seoul National University Hospital Departure:{" "}
              {item.SeoulNationalUniversityHospitalDeparture}
            </Text>
            <Text style={styles.itemText}>
              Terminal Arrival: {item.TerminalArrival}
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
