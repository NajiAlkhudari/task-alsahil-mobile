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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { fetchClient } from "../../store/clientSlice";
import { fetchTask } from "../../store/taskSlice";
import { detail } from "../../store/meSlice";
import { postVisit } from "../../store/visitSlice";
import Toast from "react-native-toast-message";
import DropDownPicker from "react-native-dropdown-picker";
import * as Localization from 'expo-localization';

const AddVisit = () => {
  const dispatch = useDispatch();

  const direction = "rtl";
  const textAlign = "right";
  const [notes, setNotes] = useState("");

  const {
    clients,
    loading: clientsLoading,
    error: clientsError,
  } = useSelector((state) => state.clients);
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useSelector((state) => state.tasks);
  const { id } = useSelector((state) => state.me);
  const {
    loading: visitLoading,
    error: visitError,
    success: visitSuccess,
  } = useSelector((state) => state.visits);

  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [clientsItems, setClientsItems] = useState([]);
  const [amountReceived, setAmountReceived] = useState("");

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



  const handleTaskSelect = (itemValue) => {
    if (itemValue && !selectedTasks.includes(itemValue)) {
      setSelectedTasks([...selectedTasks, itemValue]);
    }
  };

  const handleTaskRemove = (taskId) => {
    setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
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
      completionDate: new Date().toISOString(),
      notes,
      amountReceived,
      taskDto: selectedTasks.map((taskId) => ({
        taskId: taskId,
        taskName:
          formattedTasks.find((t) => t.value === taskId)?.label ||
          "Unknown Task",
      })),
    };

    dispatch(postVisit(postData)).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        Toast.show({
          type: "success",
          text1: "نجاح",
          text2: "تمت اضافة الزيارة بنجاح",
          textStyle: { textAlign },
        });
        setSelectedClientId(null);
        setSelectedTasks([]);
      } else if (response.meta.requestStatus === "rejected") {
        Toast.show({
          type: "error",
          text1: "خطأ",
          text2: "فشل في اضافة زيارة جديدة حاول مجددا",
          textStyle: { textAlign },
        });
      }
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { direction }]}>
      {clientsError && (
        <Text style={[styles.errorText, { textAlign }]}>
          حدث خطأ أثناء تحميل العملاء: {clientsError}
        </Text>
      )}
      {tasksError && (
        <Text style={[styles.errorText, { textAlign }]}>
          حدث خطأ أثناء تحميل المهام: {tasksError}
        </Text>
      )}
      {visitError && (
        <Text style={[styles.errorText, { textAlign }]}>
          حدث خطأ أثناء إرسال الزيارة: {visitError}
        </Text>
      )}

      {(clientsLoading || tasksLoading || visitLoading) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1769aa" />
          <Text style={[styles.loadingText, { textAlign: 'center' }]}>جاري التحميل...</Text>
        </View>
      )}

      {!clientsError && !tasksError && !clientsLoading && !tasksLoading && (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.pickerContainer}>
            <Text style={[styles.label, {  }]}>اختر العميل:</Text>
            <DropDownPicker
              open={open}
              value={selectedClientId}
              items={clientsItems}
              setOpen={setOpen}
              setValue={setSelectedClientId}
              setItems={setClientsItems}
              searchable={true}
              placeholder="ابحث عن اسم العميل"
              listMode="MODAL"
              modalProps={{
                animationType: "slide",
              }}
              style={[styles.dropdown, {  }]}
              dropDownContainerStyle={styles.dropdownContainer}
              loading={clientsLoading}
              searchablePlaceholder="ابحث عن العميل"
              textStyle={{  }}
              itemTextStyle={{  }}
              placeholderStyle={{  }}
              containerStyle={{ direction }}
            />
          </View>

          <View style={styles.pickerContainer}>
            <Text style={[styles.label, {  }]}>اختر المهام:</Text>
            <Picker
              selectedValue={null}
              onValueChange={(itemValue) => handleTaskSelect(itemValue)}
              style={[styles.picker, { direction }]}
              mode="dropdown"
              itemStyle={{ textAlign, direction }}
            >
              <Picker.Item label="اختر مهمة" value="" />
              {formattedTasks.map((task) => (
                <Picker.Item
                  key={task.value}
                  label={task.label}
                  value={task.value}
                  style={{ textAlign, direction }}
                />
              ))}
            </Picker>

            {selectedTasks.length > 0 && (
              <View style={[styles.selectedTasksContainer, { flexDirection: direction === 'rtl' ? 'row-reverse' : 'row' }]}>
                {selectedTasks.map((taskId) => {
                  const task = formattedTasks.find((t) => t.value === taskId);
                  return (
                    <View key={taskId} style={[styles.taskLabel, { flexDirection: direction === 'rtl' ? 'row-reverse' : 'row' }]}>
                      <Text style={[styles.taskLabelText, { textAlign }]}>{task?.label}</Text>
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
            )}
          </View>

      <Text style={[styles.label, {  }]}>المبلغ المقبوض:</Text>
      <TextInput
        style={[styles.textInput1, { textAlign }]}
        placeholder="أدخل المبلغ"
        keyboardType="numeric"
        value={amountReceived}
        onChangeText={setAmountReceived}
      />


    <View style={styles.pickerContainer}>
            <Text style={[styles.label, {  }]}>الملاحظات:</Text>
            <TextInput
              style={[styles.textInput, { textAlign }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="اضف ملاحظة (اختياري)"
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
      <Text style={styles.addButtonText}>إضافة الزيارة</Text>
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
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
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
    fontWeight: "600",
  },
  picker: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fafafa",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "#fafafa",
    elevation: 2,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    borderRadius: 12,
    elevation: 2,
  },
  selectedTasksContainer: {
    flexWrap: "wrap",
    marginTop: 10,
  },
  textInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "#fafafa",
    padding: 10,
    textAlignVertical: 'top',
  },


  textInput1: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "#fafafa",
    padding: 10,
    textAlignVertical: 'top',
  },

  taskLabel: {
    alignItems: "center",
    backgroundColor: "#E1F5FE",
    borderRadius: 16,
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 18,
    color: "#1769aa",
    fontSize: 18,
    textAlign: 'center',
  },
  addButtonContainer: {
    alignItems: "center",
    marginTop: 20,
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
});
