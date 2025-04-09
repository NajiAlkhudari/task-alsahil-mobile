import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClient } from '../store/clientSlice';
import { fetchTask } from '../store/taskSlice';
import { detail } from '../store/meSlice';
import { postVisit } from '../store/visitSlice';
import Toast from 'react-native-toast-message'; 

const AddVisit = () => {
  const dispatch = useDispatch();

  const { clients, loading: clientsLoading, error: clientsError } = useSelector((state) => state.clients);
  const { tasks, loading: tasksLoading, error: tasksError } = useSelector((state) => state.tasks);
  const { id } = useSelector((state) => state.me);
  const { loading: visitLoading, error: visitError, success: visitSuccess } = useSelector((state) => state.visits);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    dispatch(fetchClient());
    dispatch(fetchTask());
    dispatch(detail());
  }, [dispatch]);

  const formattedClients = clients.map((client) => ({
    label: client.name,
    value: client.id,
  }));

  const formattedTasks = tasks.map((task) => ({
    label: task.taskName,
    value: task.id,
  }));

  const handleTaskSelect = (taskId) => {
    if (!selectedTasks.includes(taskId)) {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const handleTaskRemove = (taskId) => {
    setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
  };

  const handleSubmitVisit = () => {
    if (!selectedClientId || selectedTasks.length === 0 || !id) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select a client and at least one task.',
      });
      return;
    }

    const postData = {
      userId: id,
      clientId: selectedClientId,
      completionDate: new Date().toISOString(),
      taskDto: selectedTasks.map(taskId => ({
        taskId: taskId,
        taskName: formattedTasks.find((t) => t.value === taskId)?.label || "Unknown Task",
      })),
    };
    console.log("Sending Visit Data:", postData);

    dispatch(postVisit(postData))
      .then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Visit added successfully!',
          });
          setSelectedClientId('');
          setSelectedTasks([]);
        } else if (response.meta.requestStatus === 'rejected') {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to add visit. Please try again.',
          });
        }
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {clientsError && <Text style={styles.errorText}>Clients Error: {clientsError}</Text>}
      {tasksError && <Text style={styles.errorText}>Tasks Error: {tasksError}</Text>}
      {visitError && <Text style={styles.errorText}>Visit Error: {visitError}</Text>}

      {(clientsLoading || tasksLoading || visitLoading) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#147EFB" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {!clientsError && !tasksError && !clientsLoading && !tasksLoading && (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Select a Client:</Text>
            <Picker
              selectedValue={selectedClientId}
              onValueChange={(itemValue) => setSelectedClientId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select an option" value="" />
              {formattedClients.map((client) => (
                <Picker.Item key={client.value} label={client.label} value={client.value} />
              ))}
            </Picker>
         
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Select Tasks:</Text>
            <Picker
              selectedValue={null}
              onValueChange={(itemValue) => handleTaskSelect(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select an option" value="" />
              {formattedTasks.map((task) => (
                <Picker.Item key={task.value} label={task.label} value={task.value} />
              ))}
            </Picker>
            {selectedTasks.length > 0 && (
              <View style={styles.selectedTasksContainer}>
                {selectedTasks.map((taskId) => {
                  const task = formattedTasks.find((t) => t.value === taskId);
                  return (
                    <View key={taskId} style={styles.taskLabel}>
                      <Text style={styles.taskLabelText}>{task?.label}</Text>
                      <TouchableOpacity onPress={() => handleTaskRemove(taskId)}>
                        <Text style={styles.removeTaskButton}>×</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.addButtonContainer}>
            {visitLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <TouchableOpacity style={styles.addButton} onPress={handleSubmitVisit}>
                <Text style={styles.addButtonText}>Add Visit</Text>
              </TouchableOpacity>
            )}
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
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
    fontWeight: '600',
  },
  picker: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f1f1f1',
    paddingLeft: 10,
    marginBottom: 10,
  },
  selectedTasksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  taskLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1F5FE',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  taskLabelText: {
    fontSize: 14,
    color: '#0277BD',
  },
  removeTaskButton: {
    fontSize: 16,
    color: '#FF5252',
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 8,
    color: '#0277BD',
    fontSize: 18,
  },
  addButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#0277BD',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    elevation: 5,  
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
