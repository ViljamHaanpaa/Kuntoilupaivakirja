import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList } from "react-native";
import { renderAchievements } from "../../components/AchievementsChart";
import { fetchActivities } from "../../components/fetchContent/fetchActivities";
import { useFocusEffect } from "@react-navigation/native";
export const Achievements = () => {
  const [activities, setActivities] = useState([]);
  const [isactivitesnull, setisactivitesnull] = useState(false);

  // Fetch activities everytime screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const fetchedActivities = await fetchActivities();
          console.log(fetchedActivities);
          if (fetchedActivities.length === 0) {
            console.log("No activities found");
            setActivities([]);
            setisactivitesnull(true);
            return;
          }
          const groupedActivities =
            groupActivitiesByCategory(fetchedActivities);
          setActivities(groupedActivities);
        } catch (error) {
          console.error("Error fetching acggggtivit monkeies:", error);
        }
      };
      fetchData();
    }, [])
  );
  // sort and group activities by category
  const groupActivitiesByCategory = (activities) => {
    const grouped = {};
    activities.forEach((activity) => {
      const category = activity.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(activity);
    });
    return Object.keys(grouped).map((category) => ({
      category,
      activities: grouped[category],
    }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#141414" }}>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          marginBottom: 50,
          marginTop: 20,
        }}
      >
        {isactivitesnull ? (
          <View style={{ width: "80%" }}>
            <Text
              style={{
                color: "darkgrey",
                fontSize: 20,
                top: 300,
                alignSelf: "center",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Ei tavoitteita...
            </Text>
            <Text
              style={{
                color: "grey",
                fontSize: 15,
                top: 300,
                alignSelf: "center",
                textAlign: "center",
              }}
            >
              (psst jos sinulla on tavoitteita, mutta ne eivät näy vielä täällä,
              käynnistä sovellus uudelleen :){" "}
              {/* // for some reason the chart might not load first time so this is a placeholder */}
            </Text>
          </View>
        ) : (
          <FlatList
            data={activities}
            renderItem={renderAchievements}
            keyExtractor={(item) => item.category}
            horizontal={false}
            style={styles.flatListStyle}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flatListStyle: {
    width: "100%",
  },
  itemContainerAchievements: {
    width: "100%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#494949",
    borderRadius: 20,
    marginVertical: 50,
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
});
