import React from "react";
import Map from "./screens/Map";
import Home from "./screens/Home";
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
        options={{ headerShown: false }}
      ></Stack.Screen>
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
