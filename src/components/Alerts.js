//here are all the alerts that the application needs
import { Alert } from "react-native";

export const KmOrMinutesAlert = ({ onKmPress, onMinutesPress, onCancel }) => {
  const showKmOrMinutesAlert = () => {
    Alert.alert("Valitse", "Haluatko lisätä tavoite-ajan vai -matkan?", [
      {
        text: "Kilometrit",
        onPress: () => {
          Alert.prompt(
            "Kilometrit",
            "Montako kilometriä aiot liikkua?",
            [
              {
                text: "Peruuta",
                onPress: () => console.log("Cancelled"),
                style: "cancel",
              },
              {
                text: "OK",
                onPress: (text) => {
                  const kilometers = parseFloat(text);
                  if (!isNaN(kilometers)) {
                    onKmPress(kilometers);
                  } else {
                    console.log("Invalid input for kilometers");
                  }
                },
              },
            ],
            "plain-text",
            null,
            "numeric"
          );
        },
      },
      {
        text: "Minuutit",
        onPress: () => {
          Alert.prompt(
            "Minuutit",
            "Montako minuuttia aiot suorittaa?",
            [
              {
                text: "Peruuta",
                onPress: () => console.log("Cancelled"),
                style: "cancel",
              },
              {
                text: "OK",
                onPress: (text) => {
                  const minutes = parseFloat(text);
                  if (!isNaN(minutes)) {
                    onMinutesPress(minutes);
                  } else {
                    console.log("Invalid input for minutes");
                  }
                },
              },
            ],
            "plain-text",
            null,
            "numeric"
          );
        },
      },
      {
        text: "Peruuta",
        onPress: () => {
          console.log("Cancelled");
          if (onCancel) {
            onCancel();
          }
        },
        style: "cancel",
      },
    ]);
  };
  showKmOrMinutesAlert();
};

export const AreYouSureToEndAlert = ({ onYesPress, onCancel }) => {
  Alert.alert("Oletko varma?", "Haluatko lopettaa aktiviteetin?", [
    {
      text: "Kyllä",
      onPress: () => {
        onYesPress();
      },
    },
    {
      text: "Peruuta",
      onPress: () => {
        console.log("Cancelled");
      },
      style: "cancel",
    },
  ]);
};

export const DidYouReachGoalAlert = ({ onYesPress, onNoPress }) => {
  try {
    Alert.alert("Saavutitko tavoitteesi?", [
      {
        text: "Kyllä",
        onPress: () => {
          onYesPress();
        },
      },
      {
        text: "En",
        onPress: () => {
          onNoPress();
        },
        style: "cancel",
      },
    ]);
  } catch (error) {
    console.error("Error displaying alert:", error);
  }
};
