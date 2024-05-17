import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const Timetable = ({ loading, error, data, Station, selectedSchedule, selectedDay, styles }) => {
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

export default Timetable;
