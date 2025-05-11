


import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { handleLogout } from '../utils/handleLogout'; 

const Avatar = ({ size = 50, source, borderColor = '#ccc', borderWidth = 2 }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false); 

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const logout = handleLogout();

  return (
    <View>
      <TouchableOpacity onPress={toggleMenu} style={[styles.container, { width: size, height: size, borderRadius: size / 2, borderColor, borderWidth }]}>
        {source ? (
          <Image 
            source={source} 
            style={[styles.image, { width: size - borderWidth * 2, height: size - borderWidth * 2, borderRadius: (size - borderWidth * 2) / 2 }]} 
          />
        ) : (
          <MaterialIcons name="person" size={size * 0.6} color="#888" />
        )}
      </TouchableOpacity>

      <Modal visible={isMenuVisible} transparent={true} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={toggleMenu}>
          <View style={styles.menuContainer}>
            <Pressable style={styles.menuItem} onPress={() => { logout(); toggleMenu(); }}>
              <Text style={styles.menuText}>تسجيل خروج</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    marginRight: 15,
  },
  image: {
    resizeMode: 'cover',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: 200,
    alignItems: 'center',
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  menuText: {
    fontSize: 16,
    color: '#1769aa',
  },
});

export default Avatar;