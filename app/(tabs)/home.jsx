import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchComplete } from "../../store/visitSlice";
import { detail } from "../../store/meSlice";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Localization from 'expo-localization';
import { fetchDataStatics } from "../../store/staticsSlice";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import LoadingSkeleton from "../../components/LoadingSkeleton";

const Home = () => {
  const dispatch = useDispatch();
  const { visits, loading } = useSelector((state) => state.visits);
  const { id } = useSelector((state) => state.me);
  const { statics, loading: loadingStatics, error } = useSelector((state) => state.statics);
  const router = useRouter();

  const locales = Localization.getLocales();
  const isRTL = locales.length > 0 ? locales[0].textDirection === 'rtl' : false;
  const direction = isRTL ? 'rtl' : 'ltr';
  const dynamicTextAlign = { textAlign: isRTL ? 'right' : 'left' };
  const dynamicFlexDirection = { flexDirection: isRTL ? 'row-reverse' : 'row' };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    if (!id) return;
    setRefreshing(true);
    Promise.all([
      dispatch(fetchComplete(id)),
      dispatch(fetchDataStatics(id))
    ]).finally(() => setRefreshing(false));
  }, [dispatch, id]);

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
        dispatch(fetchComplete(id));
        dispatch(fetchDataStatics(id));
      }
    }, [id])
  );



 const formatAmountWithCommas = (amount) => {
  if (amount == null) return "0";
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) return "0";
  return numericAmount.toLocaleString("en-US");
};


  const formatStatus = (status) => {
    return status === 0 ? "قيد التنفيذ" : "تم الإنجاز";
  };

  if (( loading || loadingStatics) && !refreshing) {
    return (
      <View style={styles.background}>
        <SafeAreaView style={[styles.container, { writingDirection: direction }]}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            <LoadingSkeleton />
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      <SafeAreaView style={[styles.container, { writingDirection: direction }]}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          <View style={styles.staticsContainer}>
            {error ? (
              <Text style={styles.error}>خطأ: {error}</Text>
            ) : statics ? (
              <View style={styles.dashboardRow}>
                <StatItem label="التدريب" value={statics.trainingVisits} icon={<FontAwesome5 name="handshake" size={24} color="#024a70" />} />
                <StatItem label="الصيانة" value={statics.maintenanceVisits} icon={<FontAwesome5 name="cog" size={24} color="#024a70" />} />
                <StatItem label="المبلغ" value={`${formatAmountWithCommas(statics.totalAmountCollected)} ل.س`} icon={<FontAwesome5 name="money-bill-wave" size={24} color="#024a70" />} />
              </View>
            ) : (
              <Text style={styles.noDataText}>
                {isRTL ? "لا توجد بيانات إحصائية" : "No statics available"}
              </Text>
            )}
          </View>

       {visits.length > 0 ? (
  visits.map((item) => (
<View key={`${item.id}-${item.completionDate}`} style={[styles.cardContainer, dynamicFlexDirection]}>
        <View style={styles.sideLine}>
          <Text style={styles.sideLineText}>
            {new Date(item.completionDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.title, dynamicTextAlign]}>{item.clientName}</Text>
        
          </View>
          <Text style={[styles.cardText, dynamicTextAlign]}>
            • {item.visitTasks?.[0]?.task?.taskName ?? "لا يوجد مهمة"}
          </Text>
          <Text style={[styles.cardText1, dynamicTextAlign]}>
            {formatStatus(item.status)}
          </Text>
<Text style={[styles.cardText, dynamicTextAlign]}>
  💰 {formatAmountWithCommas(item.amountReceived)} ل.س
</Text>
        </View>
      </View>
    )
  )
) :
  (
            <Text style={styles.noDataText}>
              {isRTL ? "لا توجد تقارير متاحة" : "No reports available"}
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const StatItem = ({ label, value, icon }) => (
  <View style={styles.statItem}>
    <Text style={styles.label}>{icon}</Text>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  container: {
    flex: 1,
  },
  staticsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 4,
    margin: 20,
    height: 150,
    justifyContent: 'center',
  },
  dashboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    color: '#024a70',
    marginTop: 4,
    fontFamily: 'Cairo-Regular',
  },
  value: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Cairo-Bold',
  },
  cardContainer: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
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
    fontFamily: 'Cairo-Regular',
  },
  cardContent: {
    flex: 1,
    padding: 15,
    gap: 2,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
    fontFamily: 'Cairo-Regular',
  },
  cardText1: {
    fontSize: 14,
    marginBottom: 5,
    color: "#00c853",
    fontFamily: 'Cairo-Light',
  },
  title: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'Cairo-Bold',
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
    marginTop: 20,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
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
  checkButton: {
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
    padding: 6,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    minHeight: 32,
  },
});

export default Home;
