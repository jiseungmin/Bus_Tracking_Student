import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';

const Home = ({ navigation }) => {
  // 각 항목을 클릭했을 때 호출될 함수들
  const goToScreen = (screenName) => {
    navigation.navigate("Stage", {screenName});
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true
    );

    return () => backHandler.remove(); // 컴포넌트 해제 시 이벤트 리스너 제거
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>SMUBUS</Text>

      <TouchableOpacity onPress={() => goToScreen('Cheonan Terminal')}>
        <Text style={styles.item}>천안터미널</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => goToScreen('Cheonan Station')}>
        <Text style={styles.item}>천안역</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => goToScreen('Cheonan Asan Station')}>
        <Text style={styles.item}>천안아산역</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => goToScreen('Onyang Oncheon Station')}>
        <Text style={styles.item}>온양온천역/아산터미널</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => goToScreen('Cheonan Campus')}>
        <Text style={styles.item}>천안캠퍼스</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => goToScreen('Screen2')}>
        <Text style={styles.item}>시간표 바로가기</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // 배경색을 하얀색으로 설정합니다.
    alignItems: 'center', // 가로축을 중앙에 정렬합니다.
    justifyContent: 'center', // 세로축을 중앙에 정렬합니다.
    paddingVertical: 20, // 위아래 여백을 줍니다.
  },
  title: {
    fontSize: 26, // 제목의 글꼴 크기를 설정합니다.
    fontWeight: 'bold', // 글꼴 두께를 굵게 합니다.
    marginBottom: 40, // 제목 아래의 여백을 줍니다.
  },
  item: {
    fontSize: 20, // 항목의 글꼴 크기를 설정합니다.
    marginBottom: 20, // 항목 간의 여백을 줍니다.
  },
  textStyle: {
    color: 'black',
    marginBottom: 50,
    fontSize: 36,
    fontWeight: 'bold', // 텍스트의 두께를 조절합니다.
  },
});

export default Home;
