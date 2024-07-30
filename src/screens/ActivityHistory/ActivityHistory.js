import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchActivities } from "../../components/fetchContent/fetchActivities";
import { DateFormatter } from "../../components/timeformatter";
export const ActivityHistory = () => {
  const [search, setSearch] = useState("");
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);

  //so that it updates the screen for every render
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setActivities(await fetchActivities());
        } catch (error) {
          console.error("Error fetching acggggtivities: first screen", error);
        }
      };
      fetchData();
    }, [])
  );

  //this not working at this time :D havent finished it yet. all the "homemade" search algorithms i make are goofy af
  const handleSearch = (text) => {
    if (!Array.isArray(activities) || activities.length === 0) {
      console.log("No activities found");
      return;
    }
    const filteredData = activities.filter(
      (activity) =>
        activity.name.toLowerCase().includes(text.toLowerCase()) ||
        activity.goal.toLowerCase().includes(text.toLowerCase()) ||
        activity.category.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredActivities(filteredData);
  };

  // Function to render each item  AKA activity in the flatlist
  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.texContainer}>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.itemText}>{item.goal}</Text>
          <Text style={styles.itemText}>{item.category}</Text>
          <Text style={styles.itemText}>
            {item.status === "Succeed"
              ? "Tavoite saavutettu"
              : "Et saavuttanut tavotetta"}
          </Text>

          <Text style={styles.itemText}>
            {DateFormatter({ date: item.date })}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.trashIconContainer}
          onPress={() => handleDeleteActivity(item.name)}
        >
          <Icon name="trash" size={30} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  // Function to handle deletion of an activity // missing alert that is in the project plan
  const handleDeleteActivity = async (activityId) => {
    try {
      const existingActivitiesJSON = await AsyncStorage.getItem("activities");
      const existingActivities = existingActivitiesJSON
        ? JSON.parse(existingActivitiesJSON)
        : [];

      const updatedActivities = existingActivities.filter(
        (activity) => activity.name !== activityId
      );
      const updatedActivitiesJSON = JSON.stringify(updatedActivities);
      await AsyncStorage.setItem("activities", updatedActivitiesJSON);
      setActivities(updatedActivities);
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={{ fontSize: 24, marginBottom: 20, color: "white" }}>
            Aktiviteettihistoria
          </Text>

          <SearchBar
            containerStyle={{
              width: 330,
              backgroundColor: "#0000",
            }}
            platform="default"
            placeholder="Hae..."
            lightTheme={true}
            round={true}
            inputContainerStyle={{ backgroundColor: "#0000" }}
            onChangeText={handleSearch}
            value={search}
            inputStyle={{ color: "#000" }}
          />
        </View>
      </TouchableWithoutFeedback>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        style={styles.flatListStyle}
        contentContainerStyle={{ alignItems: "center" }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  itemContainer: {
    backgroundColor: "#202020",
    width: 330,
    height: 150,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
  },
  trashIconContainer: {
    top: 15,
    right: 40,
  },
  texContainer: {
    width: 330,
    height: 150,
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  itemText: {
    fontSize: 18,
    left: 20,
    color: "white",
  },
  flatListStyle: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },
});
