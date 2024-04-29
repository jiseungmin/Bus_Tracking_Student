import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width; // 창의 너비를 가져옵니다.
const windowHeight = Dimensions.get('window').height; // 창의 높이를 가져옵니다.

const Splash = ({ navigation }) => {
  useEffect(() => {
    
    const timer = setTimeout(() => {
      navigation.navigate('Home'); 
    }, 1500); 
  
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>선문 셔틀버스</Text>

      <Image
        source={require('../assets/Splash.png')}
        style={styles.imageStyle}
      />

      <Text style={styles.subTextStyle}>안전하고 편리한 셔틀버스을 이용하세요.</Text>
      <View style={{ height: windowHeight * 0.1 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A9A9F5',
    alignItems: 'center',
    justifyContent: 'space-between', // 요소들 사이에 공간을 동일하게 분배합니다.
    paddingTop: windowHeight * 0.1, // 상단 여백
  },
  textStyle: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold', // 텍스트의 두께를 조절합니다.
  },
  imageStyle: {
    width: windowWidth * 0.5, // 너비에 대해 유동적인 크기 조정
    height: windowHeight * 0.3, // 높이에 대해 유동적인 크기 조정
    resizeMode: 'contain',
  },
  subTextStyle: {
    fontSize: 18,
    color: 'white',
    marginBottom: windowHeight * 0.1, // 하단 여백
  },
});

export default Splash;
 