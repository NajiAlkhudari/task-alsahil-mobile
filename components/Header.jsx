import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Avatar from './Avatar';
import { useSelector } from 'react-redux';

export const Header = () => {
  const { loading, error, name } = useSelector((state) => state.me);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1769aa" barStyle="light-content" />
      <View style={styles.headerContent}>
        <Avatar size={40} />
        <View style={styles.textContainer}>
          <Text style={styles.greetingText}>
            مرحبا، <Text style={styles.nameText}>{name}</Text>
          </Text>
          <Text style={styles.subText}>زياراتك</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#024a70',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#125a91',
    paddingLeft: 20,
    paddingTop: 50,
    paddingRight :10,

    
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  greetingText: {
    color: '#fff',
    fontSize: 25,
    textAlign: 'right',
  },
  nameText: {
    fontWeight: '900',
  },
  subText: {
    color: '#fff',
    fontStyle: 'italic',
    paddingTop: 8,
    fontSize: 14,
    textAlign: 'right',
  },
});
