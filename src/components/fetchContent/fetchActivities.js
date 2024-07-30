import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchActivities = async () => {
  try {
    const activitiesJSON = await AsyncStorage.getItem("activities");
    if (activitiesJSON !== null) {
      const activitiesData = JSON.parse(activitiesJSON);
      return activitiesData;
    }
  } catch (error) {
    console.error("vities:", error);
  }
};
