import React, { useCallback, useState, useMemo } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { BottomSheetCategory } from "../../components/BottomSheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  KmOrMinutesAlert,
  AreYouSureToEndAlert,
} from "../../components/Alerts";
import { startTimer, stopTimer, pauseTimer } from "../../components/timer";

export function AddActivity() {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [category, setCategory] = useState("");
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isActivityActive, setIsActivityActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);

  // timerin toggle handling
  const toggleTimer = () => {
    if (isPaused) {
      startTimer(setTimer, setTimerId, pausedTime, setIsPaused);
    } else {
      pauseTimer(setTimerId, setPausedTime, setIsPaused, timer, timerId);
    }
  };

  // sulkee category bottomsheetin
  const closeBottomSheet = useCallback(() => {
    setShowBottomSheet(false);
  }, [setShowBottomSheet]);

  const handleInputChange = (text) => {
    setName(text);
  };

  const handleEdit = () => {
    setIsEditingName(true);
  };

  // tallentaa nimen aktiviteetille
  const handleSaveName = () => {
    AsyncStorage.setItem("name", name)
      .then(() => {
        console.log("Name saved");
        setIsEditingName(false);
        Keyboard.dismiss();
      })
      .catch((error) => {
        console.log("Error saving name", error);
      });
  };

  // lisää kategoria handling
  const handleKmPress = (kilometers) => {
    try {
      AsyncStorage.setItem("goal", kilometers.toString() + "km");
    } catch (error) {
      console.error("Error saving kilometers:", error);
    }
    setGoal(kilometers + " km");
  };
  // lisää minuutit handling
  const handleMinutesPress = async (minutes) => {
    try {
      await AsyncStorage.setItem("goal", minutes.toString() + "min");
    } catch (error) {
      console.error("Error saving minutes:", error);
    }
    setGoal(minutes + " min");
  };

  const addGoal = () => {
    KmOrMinutesAlert({
      onKmPress: handleKmPress,
      onMinutesPress: handleMinutesPress,
    });
  };

  const handleSelectCategory = (selectedCategory) => {
    closeBottomSheet();
    setCategory(selectedCategory);
  };

  // aloita aktiviteetti handling
  const startActivity = async () => {
    const existingActivitiesJSON = await AsyncStorage.getItem("activities");
    const existingActivities = existingActivitiesJSON
      ? JSON.parse(existingActivitiesJSON)
      : [];

    const isDuplicateName = existingActivities.some(
      (activity) => activity.name === name
    );
    if (isDuplicateName) {
      alert("Tällä nimellä on jo aktiviteetti olemassa");
      return;
    }
    if (!name || !goal || !category) {
      alert("Täytä kaikki kentät");
      return;
    }
    setIsActivityActive(true);
    startTimer(setTimer, setTimerId, pausedTime, setIsPaused);
  };

  //aktiviteetin päättäminen ja tallentaminen
  const saveActivity = async () => {
    const now = new Date();
    let succeeded = false;

    if (goal.includes("min")) {
      try {
        const goalValue = parseInt(goal);
        const goalInSeconds = goalValue * 60;
        const timerParts = timer.split(":");
        const timerInSeconds =
          parseInt(timerParts[0]) * 60 +
          (timerParts[1] ? parseInt(timerParts[1]) : 0);

        succeeded = timerInSeconds >= goalInSeconds;
      } catch (error) {
        console.error("Error processing timer and goal:", error);
      }
    } else {
      await new Promise((resolve, reject) => {
        Alert.alert(
          "Saavuititko tavoitteesi?",
          "",
          [
            {
              text: "En",
              onPress: () => {
                succeeded = false;
                resolve();
              },
              style: "cancel",
            },
            {
              text: "Kyllä",
              onPress: () => {
                succeeded = true;
                resolve();
              },
            },
          ],
          { cancelable: false }
        );
      });
    }

    const activityDetails = {
      name: name,
      goal: goal,
      category: category,
      date: now.toISOString(),
      status: succeeded ? "Succeed" : "Failed",
      timer: timer,
    };

    try {
      const existingActivitiesJSON = await AsyncStorage.getItem("activities");
      const existingActivities = existingActivitiesJSON
        ? JSON.parse(existingActivitiesJSON)
        : [];

      const updatedActivities = [...existingActivities, activityDetails];
      const updatedActivitiesJSON = JSON.stringify(updatedActivities);
      await AsyncStorage.setItem("activities", updatedActivitiesJSON);
    } catch (error) {
      alert("Error saving activity");
      console.error("Error saving activity:", error);
    }
  };

  // resets fields after activity has ended or cancelled
  const resetFields = () => {
    setName("");
    setGoal("");
    setCategory("");
    setPausedTime(0);
  };

  // lopeta aktiviteetti handling
  const handleEndActivity = async () => {
    AreYouSureToEndAlert({
      onYesPress: async () => {
        try {
          await saveActivity();
          setIsActivityActive(false);
          resetFields();
          stopTimer(setTimer, setTimerId, timerId);
        } catch (error) {
          console.error("Error handling end of activity:", error);
        }
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#141414" }}>
        {!isActivityActive ? (
          <View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "flex-start",
                marginBottom: 70,
              }}
            ></View>
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",

                width: "90%",
                alignSelf: "center",
                borderRadius: 15,
              }}
            >
              <Text style={{ fontSize: 28, color: "grey", marginBottom: 20 }}>
                Lisää uusi aktiviteetti
              </Text>
              {isEditingName ? (
                <View style={styles.NameContainerPog}>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleInputChange}
                    value={name}
                    placeholder="Lisää aktiviteetin nimi..."
                    placeholderTextColor={"gray"}
                    placeholderStyle={{ fontSize: 18 }}
                    autoFocus={true}
                    onEndEditing={handleSaveName}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.NameContainer}
                  onPress={handleEdit}
                >
                  <Text style={styles.nameText}>{name || "Nimi"}</Text>
                  <Icon
                    name="pencil-sharp"
                    size={20}
                    color="white"
                    style={{ marginLeft: 10 }}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.addGoal} onPress={addGoal}>
                <Text style={styles.Text}>{goal || "Lisää Tavoite"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addCategory}
                onPress={() => setShowBottomSheet(true)}
              >
                <Text style={styles.Text}>{category || "Lisää Kategoria"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.startActivity}
                onPress={startActivity}
              >
                <Text style={styles.TextStart}>Aloita</Text>
              </TouchableOpacity>

              {showBottomSheet && (
                <BottomSheetCategory
                  onCategorySelect={handleSelectCategory}
                  onClose={closeBottomSheet}
                />
              )}
            </View>
          </View>
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 70,
            }}
          >
            <Text
              style={{
                fontSize: 40,
                top: 50,
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                fontSize: 20,
                top: 55,
                color: "grey",
                textAlign: "center",
              }}
            >
              ( {category} )
            </Text>
            <View
              style={{
                flexDirection: "row",
                top: 100,
              }}
            >
              <Text
                style={{
                  fontSize: 35,
                  marginRight: 20,
                  color: "white",
                  textAlign: "center",
                }}
              >
                <Text
                  style={{ fontSize: 20, color: "grey", textAlign: "center" }}
                >
                  Aika {"\n"}
                </Text>
                {timer}
              </Text>

              <Text
                style={{
                  fontSize: 35,
                  marginLeft: 20,
                  color: "white",
                  textAlign: "center",
                }}
              >
                <Text
                  style={{ fontSize: 20, color: "grey", textAlign: "center" }}
                >
                  Tavoite{"\n"}
                </Text>
                {goal}
              </Text>
            </View>
            {isPaused && (
              <Text
                style={{
                  position: "absolute",
                  justifyContent: "center",
                  alignSelf: "center",
                  top: 300,
                  fontSize: 60,
                  color: "white",
                }}
              >
                Tauko
              </Text>
            )}
            <View style={styles.endActivitycontainer}>
              <TouchableOpacity
                style={styles.stopActivity}
                onPress={toggleTimer}
              >
                <Text style={styles.endAcitivityText}>
                  {isPaused ? "Jatka" : "Tauko"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.stopActivity}
                onPress={handleEndActivity}
              >
                <Text style={styles.endAcitivityText}>Lopeta</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  addGoal: {
    width: 300,
    height: 50,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 1,
  },
  endAcitivityText: {
    fontSize: 20,
    color: "white",
  },
  stopActivity: {
    justifyContent: "center",
    width: 150,
    height: 50,
    borderRadius: 15,
    borderColor: "white",
    borderWidth: 1,
    alignSelf: "center",
    top: 600,
    marginLeft: 10,
    marginRight: 10,
    alignContent: "center",
    alignItems: "center",
  },
  endActivitycontainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    position: "absolute",
  },

  input: {
    flex: 1,
    fontSize: 30,
    borderBottomWidth: 1,
    borderColor: "gray",
    color: "white",
    bottom: 200,
  },
  NameContainer: {
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  NameContainerPog: {
    marginBottom: 50,
    justifyContent: "center",
  },
  Text: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
    color: "white",
  },
  TextStart: {
    fontSize: 25,
    textAlign: "center",
    color: "white",
  },
  nameText: {
    fontSize: 25,
    textAlign: "center",
    marginTop: 10,
    color: "white",
  },
  addCategory: {
    width: 300,
    height: 50,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 1,
    marginTop: 20,
  },
  startActivity: {
    justifyContent: "center",

    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: "white",
    borderWidth: 1,
    marginTop: 50,
  },
});
