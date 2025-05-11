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
import { fetchDataUser } from "../../store/reportSlice";
import { detail } from "../../store/meSlice";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Localization from 'expo-localization';

const Home = () => {
  const dispatch = useDispatch();
  const { report, loading } = useSelector((state) => state.report);
  const { id } = useSelector((state) => state.me);
  const router = useRouter();


  const locales = Localization.getLocales();
const isRTL = locales.length > 0 ? locales[0].textDirection === 'rtl' : false;
  const direction = isRTL ? 'rtl' : 'ltr';
  const dynamicTextAlign = { textAlign: isRTL ? 'right' : 'left' };
  const dynamicFlexDirection = { flexDirection: isRTL ? 'row-reverse' : 'row' };
  const dynamicButtonPosition = isRTL ? { right: 20 } : { left: 20 };

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
   <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1769aa  " />
          <Text style={[styles.loadingText, { textAlign: 'center' }]}>جاري التحميل...</Text>
        </View>
    );
  }

  return (
    <View style={styles.background}>
      <SafeAreaView style={[styles.container, { writingDirection: direction }]}>
        {report.length > 0 ? (
          <FlatList
            data={report}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.cardContainer, dynamicFlexDirection]}>
                <View style={styles.sideLine}>
                  <Text style={styles.sideLineText}>
                    {new Date(item.completionDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.bold, dynamicTextAlign]}>
                    {item.clientName}
                  </Text>
              
                  <Text style={[styles.cardText, dynamicTextAlign]}>
                    {item.address}
                  </Text>
                  {item.taskNames.map((task, index) => (
            <Text key={index} style={[styles.cardText, dynamicTextAlign ]}>• {task}</Text>
          ))}
                  <Text style={[styles.cardText1, dynamicTextAlign]}>
                    {item.amountReceived} - SYP
                  </Text>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noDataText}>
            {isRTL ? "لا توجد تقارير متاحة" : "No reports available"}
          </Text>
        )}
       
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
  },
  cardContainer: {
    marginBottom: 15,
    backgroundColor: "#fafafa",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    margin: 20,
  },
  sideLine: {
    width: 50,
    backgroundColor: "#424242",
    justifyContent: "center",
    alignItems: "center",
  },
  sideLineText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  cardText1: {
    fontSize: 14,
    marginBottom: 5,
    color: "#00c853",
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 16,
    marginBottom: 5,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
    marginTop: 20,
  },
  newVisitButton: {
    position: "absolute",
    bottom: 30,
    backgroundColor: "#FFCA28",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  loadingText: {
    marginTop: 18,
    color: "#1769aa",
    fontSize: 18,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
