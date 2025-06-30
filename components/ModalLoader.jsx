import React from "react";
import {
  View,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";

const ModalLoader = ({ visible, message = "جارٍ التحميل..." }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
  },
});

export default ModalLoader;
