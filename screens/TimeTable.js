import React, { useRef } from "react";
import { View, Platform, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const TimeTable = ({ navigation }) => {
  const webViewRef = useRef(null);
  const webviewSource =
    "https://lily.sunmoon.ac.kr/Page2/About/About08_04_02_01_01_01.aspx";

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <iframe
          ref={webViewRef}
          src={webviewSource}
          style={styles.webview}
          title="TimeTable"
        />
      ) : (
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ uri: webviewSource }}
          style={styles.webview}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default TimeTable;
