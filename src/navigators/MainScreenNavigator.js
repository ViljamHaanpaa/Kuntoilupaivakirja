import React from "react";
///Screens
import { FirstScreen } from "../screens/FirstScreen/FirstScreen";
import { ActivityHistory } from "../screens/ActivityHistory/ActivityHistory";
import { Achievements } from "../screens/Achievements/Achievements";
import { AddActivity } from "../screens/AddActivity/AddActivity";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();
export const MainScreenNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveBackgroundColor: "#141414",
          tabBarInactiveBackgroundColor: "#141414",
          tabBarLabelStyle: {
            color: "#ccc",
          },
          tabBarStyle: {
            borderTopWidth: 0,
            backgroundColor: "#141414",
          },
          tabBarInactiveTintColor: "#555",
          tabBarIcon: ({ focused, size }) => {
            let iconName;
            if (route.name === "Koti") {
              iconName = focused ? "home" : "home-outline";
            }
            if (route.name === "Historia") {
              iconName = focused ? "time" : "time-outline";
            }
            if (route.name === "Tavoitteet") {
              iconName = focused ? "trophy" : "trophy-outline";
            }
            if (route.name === "Lisää") {
              iconName = focused ? "add" : "add-outline";
            }
            const iconColor = focused ? "#ccc" : "#555";
            return <Icon name={iconName} size={size} color={iconColor} />;
          },
        })}
      >
        <Tab.Screen name="Tavoitteet" component={Achievements} />
        <Tab.Screen name="Koti" component={FirstScreen} />
        <Tab.Screen name="Historia" component={ActivityHistory} />
        <Tab.Screen name="Lisää" component={AddActivity} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
