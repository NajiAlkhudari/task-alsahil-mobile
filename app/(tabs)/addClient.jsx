import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { postClient } from "../../store/clientSlice"; // يفترض أنك تستخدم هذا الـ action
import Toast from "react-native-toast-message";
import * as Localization from "expo-localization";

const AddClient = () => {
  const dispatch = useDispatch();

  const direction = "rtl";
  const textAlign = "right";

  const [clientData, setClientData] = useState({
    name: "",
    companyName: "",
    address: "",
    phone: "",
    notes: "",
  });

  const { loading, error } = useSelector((state) => state.clients);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "خطأ",
        text2: error,
        textStyle: { textAlign },
      });
    }
  }, [error]);

  const handleSubmitClient = () => {
    const { name, companyName, address, phone } = clientData;
    if (!name || !companyName || !address) {
      Toast.show({
        type: "error",
        text1: "خطأ",
        text2: "الرجاء تعبئة جميع الحقول المطلوبة",
        textStyle: { textAlign },
      });
      return;
    }

    dispatch(postClient(clientData)).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        Toast.show({
          type: "success",
          text1: "نجاح",
          text2: "تمت اضافة العميل بنجاح",
          textStyle: { textAlign },
        });
        setClientData({
          name: "",
          companyName: "",
          address: "",
          phone: "",
          notes: "",
        });
      } else if (response.meta.requestStatus === "rejected") {
        Toast.show({
          type: "error",
          text1: "خطأ",
          text2: "فشل في اضافة عميل جديدة حاول مجددا",
          textStyle: { textAlign },
        });
      }
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { direction }]}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1769aa" />
          <Text style={[styles.loadingText, { textAlign }]}>
            جاري التحميل...
          </Text>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, {  }]}>اسم العميل:</Text>
          <TextInput
            style={[styles.textInput, { textAlign }]}
            value={clientData.name}
            onChangeText={(text) =>
              setClientData({ ...clientData, name: text })
            }
            placeholder="أدخل اسم العميل"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, {  }]}>اسم الشركة:</Text>
          <TextInput
            style={[styles.textInput, { textAlign }]}
            value={clientData.companyName}
            onChangeText={(text) =>
              setClientData({ ...clientData, companyName: text })
            }
            placeholder="أدخل اسم الشركة"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, {  }]}>العنوان:</Text>
          <TextInput
            style={[styles.textInput, { textAlign }]}
            value={clientData.address}
            onChangeText={(text) =>
              setClientData({ ...clientData, address: text })
            }
            placeholder="أدخل العنوان"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, {  }]}>رقم الهاتف:</Text>
          <TextInput
            style={[styles.textInput, { textAlign }]}
            value={clientData.phone}
            onChangeText={(text) =>
              setClientData({ ...clientData, phone: text })
            }
            placeholder="(اختياري) أدخل رقم الهاتف"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, {  }]}>ملاحظات:</Text>
          <TextInput
            style={[styles.textInput, { textAlign }]}
            value={clientData.notes}
            onChangeText={(text) =>
              setClientData({ ...clientData, notes: text })
            }
            placeholder="أضف ملاحظات (اختياري)"
            multiline={true}
          />
        </View>

        <TouchableOpacity
          style={[styles.addButton, { opacity: loading ? 0.7 : 1 }]}
          onPress={handleSubmitClient}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>إضافة العميل</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontWeight: "600",
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "#fafafa",
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: "#024a70",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 18,
    color: "#1769aa",
    fontSize: 18,
    textAlign: "center",
  },
});

export default AddClient;
