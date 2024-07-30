import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
//all the sport categories available in 1.0
export const categories = [
  "Juoksu",
  "Kävely",
  "Punttisali",
  "GoblinMode",
  "Jalkapallo",
  "Jääkiekko",
  "Tennis",
  "Koripallo",
  "Uinti",
  "Pyöräily",
  "Salibandy",
  "Lentopallo",
  "Sulkapallo",
  "Kuntosali",
  "Yoga",
  "Pilates",
  "Kahvakuula",
  "Crossfit",
];
//all the icons for the categories
const categoryIcons = {
  Juoksu: "directions-run",
  Kävely: "directions-walk",
  Punttisali: "fitness-center",
  GoblinMode: "sports-esports",
  Jalkapallo: "sports-soccer",
  Jääkiekko: "sports-hockey",
  Tennis: "sports-tennis",
  Koripallo: "sports-basketball",
  Uinti: "pool",
  Pyöräily: "directions-bike",
  Salibandy: "sports",
  Lentopallo: "sports-volleyball",
  Sulkapallo: "sports-badminton",
  Kuntosali: "fitness-center",
  Yoga: "self-improvement",
  Pilates: "self-improvement",
  Kahvakuula: "fitness-center",
  Crossfit: "fitness-center",
};
//function to get the icon for the category
export function getIconForCategory(category) {
  const iconName = categoryIcons[category] || "help";
  return <MaterialIcons name={iconName} size={40} color="white" />;
}
