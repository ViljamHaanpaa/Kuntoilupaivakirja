import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList } from "react-native";
import { fetchActivities } from "../../components/fetchContent/fetchActivities";
import { useFocusEffect } from "@react-navigation/native";
import { getIconForCategory } from "../../components/SportCategories";
import Icon from "react-native-vector-icons/Ionicons";
export function FirstScreen() {
  const [activities, setActivities] = useState([]);

  // Fetch activities everytime screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const fetchedActivities = await fetchActivities();
          if (
            !Array.isArray(fetchedActivities) ||
            fetchedActivities.length === 0
          ) {
            console.log("No activities found");
            setActivities([]); // Set to an empty array if no valid activities
            return;
          }
          const filteredActivities = fetchedActivities.filter(
            (item) => item.status === "Succeed"
          );

          setActivities((prevActivities) => {
            const activityNames = prevActivities.map(
              (activity) => activity.name
            );
            // so it doesnt duplicate the activities on every render
            const uniqueFilteredActivities = filteredActivities.filter(
              (activity) => !activityNames.includes(activity.name)
            );
            return [...prevActivities, ...uniqueFilteredActivities];
          });
        } catch (error) {
          console.error("Error fetching activitgggies:", error);
        }
      };

      fetchData();
    }, [])
  );
  // Function to render each item  AKA activities in the flatlist
  const renderSuoritukset = ({ item }) => (
    <View style={styles.itemContainerSuoritukset}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemTextCategory}>({item.category})</Text>

      <Text
        style={{
          justifyContent: "center",
          fontSize: 30,
          position: "absolute",
          bottom: 30,
          textAlign: "center",
        }}
      >
        {item.timer}
        {"\n"}
        <Text style={{ fontSize: 12, textAlign: "center", color: "#3b3b3b" }}>
          (Kesto)
        </Text>
      </Text>
    </View>
  );
  // Function to render each item  AKA goals in the flatlist
  const renderTavoitteet = ({ item }) => (
    <View style={styles.itemContainerTavoitteet}>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        {getIconForCategory(item.category)}
        <Text
          style={{
            alignSelf: "center",
            color: "lightgrey",
            fontSize: 15,
            fontWeight: "400",
            marginTop: 5,
          }}
        >
          ({item.category})
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
          alignContent: "center",
          left: 10,
        }}
      >
        <Text
          style={{
            alignSelf: "center",
            color: "white",
            fontSize: 22,
            fontWeight: "600",
          }}
        >
          {item.goal}
        </Text>
        <Icon name="checkmark-outline" size={25} color="lightgreen" />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#141414" }}>
      <View style={styles.topContainer}>
        <Text style={{ fontSize: 30, color: "white" }}>
          Tervetuloa Käyttäjä!
        </Text>
      </View>
      <View style={styles.SuorituksetContainer}>
        <View
          style={{
            height: 250,
            justifyContent: "center",
            backgroundColor: "#202020",
            alignSelf: "center",
            width: "100%",
            borderRadius: 10,
          }}
        >
          {activities.length === 0 ? (
            <Text
              style={{
                fontSize: 25,
                textAlign: "center",
                color: "grey",
                justifyContent: "center",
              }}
            >
              Ei vielä suorituksia
            </Text>
          ) : (
            <>
              <Text
                style={{
                  fontSize: 30,
                  textAlign: "left",
                  left: 20,
                  fontWeight: 500,
                  marginBottom: 20,
                  color: "white",
                }}
              >
                Suoritukset
              </Text>
              <FlatList
                data={activities}
                renderItem={renderSuoritukset}
                keyExtractor={(item) => item.name}
                horizontal={true}
                style={styles.flatListStyle}
                showsHorizontalScrollIndicator={false}
              />
            </>
          )}
        </View>
      </View>
      <View style={styles.TavoitteetContainer}>
        <View
          style={{
            height: 250,
            backgroundColor: "#202020",
            top: 20,
            width: "100%",
            justifyContent: "center",
            borderRadius: 10,
          }}
        >
          {activities.length === 0 ? (
            <Text
              style={{
                fontSize: 25,
                textAlign: "center",
                color: "grey",
                justifyContent: "center",
              }}
            >
              Ei vielä läpäistyjä tavoitteita
            </Text>
          ) : (
            <>
              <Text
                style={{
                  fontSize: 30,
                  textAlign: "left",
                  left: 20,
                  marginBottom: 20,
                  fontWeight: 500,
                  color: "white",
                }}
              >
                Läpäistyt tavoitteet
              </Text>
              <FlatList
                data={activities}
                renderItem={renderTavoitteet}
                keyExtractor={(item) => item.name}
                horizontal={true}
                style={styles.flatListStyle}
                showsHorizontalScrollIndicator={false}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  SuorituksetContainer: {
    flex: 1,
    marginTop: 50,
  },
  itemText: {
    fontSize: 20,
    bottom: 40,
  },
  itemTextCategory: {
    fontSize: 18,
    bottom: 40,
    color: "#3b3b3b",
  },
  TavoitteetContainer: {
    flex: 1,
    bottom: 20,
  },
  flatListStyle: {
    flexGrow: 0,
  },
  itemContainerSuoritukset: {
    width: 190,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    backgroundColor: "lightgreen",
    borderRadius: 20,
  },
  itemContainerTavoitteet: {
    width: 190,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    backgroundColor: "#494949",
    borderRadius: 20,
  },
});
