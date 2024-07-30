import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
// this is the chart in the achievements screen
export const renderAchievements = ({ item }) => {
  if (!item.activities || item.activities.length === 0) {
    return <Text style={{ color: "white" }}>No Data Available</Text>;
  }

  //styling for the chart
  const chartConfig = {
    backgroundColor: "#141414",
    backgroundGradientFrom: "#141414",
    backgroundGradientTo: "#141414",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 10,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "1",
      stroke: "lightgreen",
    },
  };
  const dataPoints = item.activities.map((activity) =>
    parseFloat(activity.goal.replace(" km", ""))
  );
  const labels = item.activities.map((activity) => {
    const date = activity.date;
    return `${date.substring(8, 10)}.${date.substring(5, 7)}`;
  });

  console.log("Rendering chart for category:", item.category);
  console.log("Data points:", dataPoints);
  console.log("Labels:", labels);

  return (
    <View style={styles.itemContainerAchievements}>
      <Text
        style={{
          color: "white",
          marginBottom: 10,
          marginTop: 10,
          fontSize: 25,
          fontWeight: "bold",
        }}
      >
        {" "}
        {item.category}
      </Text>

      <LineChart
        data={{
          labels,
          datasets: [{ data: dataPoints }],
        }}
        width={Dimensions.get("window").width - 20}
        height={220}
        yAxisLabel="km "
        yAxisSuffix=""
        chartConfig={chartConfig}
        style={styles.chartStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  itemContainerAchievements: {
    backgroundColor: "#202020",
    marginBottom: 20,
    borderRadius: 15,
    width: "100%",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 10,
    marginBottom: 40,
  },
});
