import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import axios from "axios";

const Dashboard = () => {
  const [totalUser, setTotalUser] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalMetalOrder, setTotalMetalOrder] = useState(0);
  const [totalPlasticOrder, setTotalPlasticOrder] = useState(0);
  const [totalGlassOrder, setTotalGlassOrder] = useState(0);
  const [totalElectronicsOrder, setTotalElectronicsOrder] = useState(0);
  const [price, setPrice] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "http://192.168.52.229:3000/api/v1/user"
      );
      setTotalUser(response.data.length);
      let totalRevenue = 0;
      response.data.map((item) => {
        item.order.map((order) => {
          totalRevenue += order.price;
          setPrice((prev)=>[...prev,order.price])
          if (order.category === "metal")
            setTotalMetalOrder((prev) => prev + 1);
          else if (order.category === "plastic")
            setTotalPlasticOrder((prev) => prev + 1);
          else if (order.category === "glass")
            setTotalGlassOrder((prev) => prev + 1);
          else setTotalElectronicsOrder((prev) => prev + 1);
        });
      });
      setTotalRevenue(totalRevenue);
    }
    fetchData();
  }, []);

  const screenWidth = Dimensions.get("window").width;

  const pieData = [
    {
      name: "Metal",
      population: totalMetalOrder,
      color: "#388E3C",
      legendFontColor: "#003300",
      legendFontSize: 14,
    },
    {
      name: "Plastic",
      population: totalPlasticOrder,
      color: "#66BB6A",
      legendFontColor: "#003300",
      legendFontSize: 14,
    },
    {
      name: "Glass",
      population: totalGlassOrder,
      color: "#A5D6A7",
      legendFontColor: "#003300",
      legendFontSize: 14,
    },
    {
      name: "Electronic",
      population: totalElectronicsOrder,
      color: "#C8E6C9",
      legendFontColor: "#003300",
      legendFontSize: 14,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Dashboard</Text>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Revenue</Text>
          <Text style={styles.cardValue}>₹{totalRevenue}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>New Users</Text>
          <Text style={styles.cardValue}>{totalUser}</Text>
        </View>
      </View>

      <LineChart
        data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              data: [10, 30, 25, 30, 95, 60],
              strokeWidth: 3,
              color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`, 
            },
          ],
        }}
        width={screenWidth - 20}
        height={250}
        yAxisLabel="₹"
        chartConfig={{
          backgroundColor: "#e8f5e9",
          backgroundGradientFrom: "#a5d6a7",
          backgroundGradientTo: "#ddfce2",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 51, 0, ${opacity})`, // Dark Green Text
          labelColor: (opacity = 1) => `rgba(0, 51, 0, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#1b5e20",
          },
        }}
        bezier
        style={styles.chart}
      />

      <Text style={styles.pieTitle}>Sales Distribution</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 20}
        height={200}
        chartConfig={{ color: () => `rgba(0, 51, 0, 1)` }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6faf5",
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2e7d32",
    marginBottom: 15,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#a5d6a7",
    padding: 20,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    color: "#003300",
    fontWeight: "bold",
  },
  cardValue: {
    fontSize: 20,
    color: "#1b5e20",
    fontWeight: "bold",
    marginTop: 5,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  pieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003300",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default Dashboard;
