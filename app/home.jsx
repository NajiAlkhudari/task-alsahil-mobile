import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataUser } from "../store/reportSlice";
import { detail } from "../store/meSlice";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";


const Home = () => {
  const dispatch = useDispatch();
  const { report, loading, error } = useSelector((state) => state.report);
  const { id } = useSelector((state) => state.me);
  const router = useRouter();



  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/(auth)/login"); 
      }
    };
    checkAuth();
  }, [id, dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(detail());
      if (id) {
        dispatch(fetchDataUser(id));
      }
    }, [id])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {report.length > 0 ? (
        <FlatList
          data={report}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <View style={styles.sideLine}>
                <Text style={styles.sideLineText}>
                  {new Date(item.completionDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>
                  <Text style={styles.bold}>Client Name:</Text> {item.clientName}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.bold}>Phone:</Text>{" "}
                  {item.clientPhone}
                </Text>
                <Text style={styles.bold}>Tasks:</Text>
                {item.reportTasks?.map((task, index) => (
                  <Text key={index} style={styles.cardText}>
                    {task.taskName}
                  </Text>
                ))}
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No reports available</Text>
      )}

      <TouchableOpacity
        style={styles.newVisitButton}
        onPress={() => router.push("/addVisit")}
      >
        <Text style={styles.buttonText}>New Visit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 15,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,

  },
  sideLine: {
    width: 70,
    backgroundColor: "#1769aa",
    justifyContent: "center",
    alignItems: "center",
  },
  sideLineText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 18,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
  },
  newVisitButton: {
    position: "absolute",
    right: 30,
    bottom: 150,
    backgroundColor: "#1769aa",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;