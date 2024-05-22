import React from "react";
import Map from "./screens/Map";
import Home from "./screens/Home";
import { Image } from "react-native";
import Splash from "./screens/Splash";
import TimeTable from "./screens/TimeTable";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

function StackScreen() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="Map"
        component={Map}
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="TimeTable"
        component={TimeTable}
        options={{
          headerShown: true,
          title: "시간표",
          headerTitleStyle: { fontWeight: "bold" },
          headerTintColor: "black",
          headerBackImage: () => (
            <Image
              source={require("./assets/backgo.png")}
              style={{
                width: 32,
                height: 32,
                marginLeft: 10,
                marginTop: 5,
              }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
}

export default Navigation;
