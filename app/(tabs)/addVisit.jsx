import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  RefreshControl,
  Platform 
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { fetchClient } from "../../store/clientSlice";
import { fetchTask } from "../../store/taskSlice";
import { detail } from "../../store/meSlice";
import { postVisit } from "../../store/visitSlice";
import Toast from "react-native-toast-message";
import DropDownPicker from "react-native-dropdown-picker";
import NetInfo from "@react-native-community/netinfo";
import FormSkeleton from "../../components/FormSkeleton";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const AddVisit = () => {
  const dispatch = useDispatch();
  const direction = "rtl";
  const textAlign = "right";
const [statusType, setStatusType] = useState(0);
const [openStatus, setOpenStatus] = useState(false);
  const [notes, setNotes] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [amountReceivedRaw, setAmountReceivedRaw] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const { clients, loading: clientsLoading, error: clientsError } = useSelector((state) => state.clients);
  const { tasks, loading: tasksLoading, error: tasksError } = useSelector((state) => state.tasks);
  const { id } = useSelector((state) => state.me);
  const { loading: visitLoading, error: visitError } = useSelector((state) => state.visits);

  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [clientsItems, setClientsItems] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);



   const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  useEffect(() => {
    dispatch(fetchClient());
    dispatch(fetchTask());
    dispatch(detail());
  }, [dispatch]);

  useEffect(() => {
    setClientsItems(
      clients.map((client) => ({
        label: `${client.name} - ${client.address}`,
        value: client.id,
      }))
    );
  }, [clients]);

  const formattedTasks = tasks.map((task) => ({
    label: task.taskName,
    value: task.id,
  }));

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchClient());
      await dispatch(fetchTask());
      await dispatch(detail());
    } finally {
      setRefreshing(false);
    }
  };

  const handleTaskSelect = (itemValue) => {
    if (itemValue && !selectedTasks.includes(itemValue)) {
      setSelectedTasks([...selectedTasks, itemValue]);
    }
  };

  const handleTaskRemove = (taskId) => {
    setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
  };

  const handleAmountChange = (text) => {
    const cleanedValue = text.replace(/[^\d.]/g, '');
    setAmountReceivedRaw(cleanedValue);
    if (cleanedValue === "") {
      setAmountReceived("");
    } else {
      const number = parseFloat(cleanedValue);
      setAmountReceived(number.toLocaleString('en-US'));
    }
  };

  const handleSubmitVisit = () => {
    if (!selectedClientId || selectedTasks.length === 0 || !id) {
      Toast.show({
        type: "error",
        text1: "خطأ",
        text2: "الرجاء اختيار عميل واحد و مهمة واحدة على الاقل.",
        textStyle: { textAlign },
      });
      return;
    }

    const postData = {
      userId: id,
      clientId: selectedClientId,
      completionDate: selectedDate.toISOString(),
      status: statusType,
      priority: 0,
      notes,
      amountReceived: parseFloat(amountReceivedRaw || "0"),
      taskDto: selectedTasks.map((taskId) => ({
        taskId: taskId,
        taskName: formattedTasks.find((t) => t.value === taskId)?.label || "Unknown Task",
      })),
    };

    console.log("postData", postData);

    dispatch(postVisit(postData)).then((response) => {
      console.log("response", response);
      if (response.meta.requestStatus === "fulfilled") {
        Toast.show({
          type: "success",
          text1: "نجاح",
          text2: "تمت اضافة الزيارة بنجاح",
          textStyle: { textAlign },
        });
        setSelectedClientId(null);
        setSelectedTasks([]);
        setNotes("");
        setSelectedDate(new Date());
        setAmountReceived("");
        setAmountReceivedRaw("");
      } else {
        let errorMsg = "فشل في اضافة زيارة جديدة حاول مجددا";
        if (response && response.payload && response.payload.message) {
          errorMsg = response.payload.message;
        } else if (response && response.error && response.error.message) {
          errorMsg = response.error.message;
        }
        Toast.show({
          type: "error",
          text1: "خطأ",
          text2: errorMsg,
          textStyle: { textAlign },
        });
      }
    });
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        dispatch(fetchClient());
        dispatch(fetchTask());
        dispatch(detail());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (!isConnected) {
      Toast.show({
        type: "error",
        text1: "لا يوجد اتصال",
        text2: "تحقق من اتصالك بالإنترنت.",
        textStyle: { textAlign },
      });
    }
  }, [isConnected]);

  return (
    <SafeAreaView style={[styles.safeArea, { direction }]}>
      {(clientsError || tasksError || visitError) && (
        <Text style={[styles.errorText, { textAlign }]}>
          {clientsError?.includes("Network") || tasksError?.includes("Network")
            ? "تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت."
            : clientsError || tasksError || visitError}
        </Text>
      )}


      {(clientsLoading || tasksLoading || visitLoading) && (

        <SafeAreaView style={[styles.safeArea, { direction }]}>
          <FormSkeleton />
        </SafeAreaView>
      )

      }
      {!clientsLoading && !tasksLoading && (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#1769aa"]}
            />
          }
        >
          <View style={styles.pickerContainer}>
            <Text style={[styles.label]}>اختر العميل</Text>
            <DropDownPicker
              open={open}
              value={selectedClientId}
              items={clientsItems}
              setOpen={setOpen}
              setValue={setSelectedClientId}
              setItems={setClientsItems}
              searchable={true}
              placeholder="ابحث عن العميل"
              listMode="MODAL"
              modalProps={{ animationType: "slide" }}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              loading={clientsLoading}
              searchablePlaceholder="ابحث عن العميل"
              textStyle={{ fontFamily: 'Cairo-Medium' }}
              containerStyle={{ direction }}
            />
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>اختر المهام</Text>
            <Picker
              selectedValue={null}
              onValueChange={(itemValue) => handleTaskSelect(itemValue)}
              style={[styles.picker, { direction }]}
              mode="dropdown"
            >
              <Picker.Item label="حدد المهمة" value="" />
              {formattedTasks.map((task) => (
                <Picker.Item key={task.value} label={task.label} value={task.value} />
              ))}
            </Picker>


{selectedTasks.map((taskId, index) => {
  const task = formattedTasks.find((t) => t.value === taskId);
  if (!taskId || !task) return null;
  return (
    <View key={`${taskId}-${index}`} style={[styles.taskLabel, { flexDirection: direction === 'rtl' ? 'row-reverse' : 'row' }]}>
      <Text style={[styles.taskLabelText, { textAlign }]}>{task.label}</Text>
      <TouchableOpacity
        onPress={() => handleTaskRemove(taskId)}
        style={[styles.removeTaskButton, { marginLeft: direction === 'rtl' ? 0 : 8, marginRight: direction === 'rtl' ? 8 : 0 }]}
      >
        <Text style={styles.removeTaskButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
})}

          </View>

<View style={styles.pickerContainer}>
  <Text style={styles.label}>نوع الحالة</Text>
  <Picker
    selectedValue={statusType}
    onValueChange={(value) => setStatusType(parseInt(value))}
    style={[styles.picker, { direction }]}
    mode="dropdown"
  >
<Picker.Item label="موعد" value={0} />
<Picker.Item label="زيارة" value={1} />
  </Picker>
</View>
          <View style={styles.pickerContainer}>
  <Text style={styles.label}>تاريخ الموعد</Text>

  {Platform.OS !== 'web' ? (
    <>
      <TouchableOpacity onPress={showDatePicker} style={styles.dateInput}>
        <Text style={[{ textAlign }, styles.dateText]}>
          {selectedDate.toLocaleDateString("ar-EG")}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        locale="ar-EG"
      />
    </>
  ) : (
    <View style={styles.webDateInput}>
      <input
        type="date"
        value={selectedDate.toISOString().split("T")[0]}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
        style={{
          fontFamily: 'Cairo-Medium',
          padding: 10,
          height: 50,
          borderRadius: 8,
          borderColor: "#ccc",
          borderWidth: 1,
          backgroundColor: "#fff",
          width: "100%",
        }}
      />
    </View>
  )}
</View>

          <Text style={styles.label}>المبلغ المقبوض</Text>
          <TextInput
            style={[styles.textInput1, { textAlign }]}
            keyboardType="numeric"
            value={amountReceived}
            onChangeText={handleAmountChange}
          />
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>الملاحظات</Text>
            <TextInput
              style={[styles.textInput, { textAlign }]}
              value={notes}
              onChangeText={setNotes}
              placeholder=" (اختياري)"
              multiline={true}
            />
          </View>

          <View style={styles.addButtonContainer}>
            <TouchableOpacity
              style={[styles.addButton, { opacity: visitLoading ? 0.7 : 1 }]}
              onPress={handleSubmitVisit}
              disabled={visitLoading}
            >
              {visitLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.addButtonText}>إضافة </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      <Toast />
    </SafeAreaView>
  );
};

export default AddVisit;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fafafa",

  },
  container: {
    padding: 20,
    backgroundColor: "#fafafa",
    gap: 4,
  },
  pickerContainer: {
    marginBottom: 20,
    zIndex: 1000,
    width: '100%',
    
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontFamily: 'Cairo-SemiBold',
  },
  picker: {
    height: 50,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    fontFamily: 'Cairo-Medium',

  },
  webDateInput: {
  width: "100%",
  marginTop: 8,
},
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
    fontFamily: 'Cairo-Medium',
    borderWidth: 0.5,

  },
  dropdownContainer: {
    borderColor: "#ccc",
    borderRadius: 8,
    elevation: 2,
    fontFamily: 'Cairo-Medium',

  },
  selectedTasksContainer: {
    flexWrap: "wrap",
    marginTop: 10,
    fontFamily: 'Cairo-Medium',

  },
  textInput: {
    height: 70,
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#ffff",
    padding: 10,
    textAlignVertical: 'top',
    fontFamily: 'Cairo-Medium',


  },
  dateInput: {
    height: 50,
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  dateText: {
    fontFamily: 'Cairo-Medium',
    color: "#333",
  },

  textInput1: {
    height: 50,
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    textAlignVertical: 'top',
    fontFamily: 'Cairo-Medium',

  },

  taskLabel: {
    alignItems: "center",
    backgroundColor: "#E1F5FE",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,

  },
  taskLabelText: {
    fontSize: 14,
    color: "#0277BD",
    flexShrink: 1,
  },
  removeTaskButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: "#FF5252",
  },
  removeTaskButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgb(255, 255, 255)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 18,
    color: "#1769aa",
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Cairo-Regular',

  },
  addButtonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#024a70",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
  },
});
