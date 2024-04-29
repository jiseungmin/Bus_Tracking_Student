import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";
import Splash from "./screens/Splash"
import Home from './screens/Home';
import Stage from './screens/Stage';


const Stack = createStackNavigator();

function StackScreen() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name="Stage" component={Stage} options={{ headerShown: false }}></Stack.Screen>
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