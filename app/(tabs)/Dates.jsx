import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchProgres, completeDate } from "../../store/visitSlice";
import { useFocusEffect } from "@react-navigation/native";

const Dates = () => {
  const dispatch = useDispatch();
  const visits = useSelector((state) => state.visits.visits);
  const loading = useSelector((state) => state.visits.loading);
  const error = useSelector((state) => state.visits.error);
  const id = useSelector((state) => state.me.id);
const [amountInput, setAmountInput] = useState({});

  const [refreshing, setRefreshing] = useState(false);
  const [completingId, setCompletingId] = useState(null);

  // Fetch visits in progress on screen focus
  useFocusEffect(
    useCallback(() => {
      if (id) {
        dispatch(fetchProgres(id));
      }
    }, [dispatch, id])
  );

  // Pull to refresh handler
  const onRefresh = useCallback(() => {
    if (!id) return;
    setRefreshing(true);
    dispatch(fetchProgres(id))
      .finally(() => setRefreshing(false));
  }, [dispatch, id]);

  // Handle complete button click
const handleComplete = async (visitId) => {
  try {
    const amountStr = amountInput[visitId];
    const amount = Number(amountStr);
    if (isNaN(amount) || amount < 0) {
      alert("الرجاء إدخال مبلغ صحيح");
      return;
    }

    setCompletingId(visitId);
    await dispatch(completeDate({ id: visitId, amountReceived: amount })).unwrap();
    setCompletingId(null);

    dispatch(fetchProgres(id));
  } catch (error) {
    setCompletingId(null);
    console.log("Error completing visit:", error);
  }
};

const handleAmountChange = (text, visitId) => {
  const cleaned = text.replace(/[^\d.]/g, '');
  setAmountInput((prev) => ({ ...prev, [visitId]: cleaned }));
};

  const formatStatus = (status) => (status === 0 ? "قيد التنفيذ" : "تم الإنجاز");

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#024a70" />
        <Text>
        جاري التحميل ...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 20 }}
      >
  {visits && visits.length > 0 ? (
  visits.map((item) => {
    const key = item.id ?? Math.random().toString();
    return (
      <View key={key} style={styles.cardContainer}>
        <View style={styles.sideLine}>
          <Text style={styles.sideLineText}>
            {new Date(item.completionDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.clientName}>{item.clientName ?? "بدون اسم"}</Text>
            <TouchableOpacity
              onPress={() => handleComplete(item.id)}
              style={styles.checkButton}
              disabled={completingId === item.id}
              activeOpacity={0.7}
            >
              {completingId === item.id ? (
                <ActivityIndicator size="small" color="#024a70" />
              ) : (
                <Text style={{ fontSize: 22, color: "#024a70" }}>✔️</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.taskName}>
            • {item.visitTasks?.[0]?.task?.taskName ?? "لا يوجد مهمة"}
          </Text>

          {item.priority === 2 && (
            <Text style={styles.priorityText}>هام</Text>
          )}

          <Text style={styles.statusText}>{formatStatus(item.status)}</Text>

          <TextInput
            style={styles.amountInput}
            placeholder="المبلغ"
            keyboardType="numeric"
            value={amountInput[item.id] || ""}
            onChangeText={(text) => handleAmountChange(text, item.id)}
            editable={completingId !== item.id}
          />
        </View>
      </View>
    );
  })
) : (
  <Text style={styles.noDataText}>لا توجد زيارات قيد التنفيذ</Text>
)}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
    overflow: "hidden",
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
    fontFamily: "Cairo-Regular",
  },
  amountInput: {
    borderColor: "#00c853",
    borderWidth: 1,
    borderRadius: 8,
    fontFamily: "Cairo-Regular",
    color: "#000",
    backgroundColor: "#fff",
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clientName: {
    fontSize: 16,
    fontFamily: "Cairo-Bold",
    marginBottom: 5,
  },
  checkButton: {
    backgroundColor: "#e8f5e9",
    borderRadius: 20,
    padding: 6,
    minWidth: 32,
    minHeight: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  taskName: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Cairo-Regular",
    marginBottom: 5,
  },
  priorityText: {
    fontSize: 14,
    color: "#d32f2f",
    fontFamily: "Cairo-Regular",
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: "#00c853",
    fontFamily: "Cairo-Light",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
    marginTop: 20,
  },
});

export default Dates;
