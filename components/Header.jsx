import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Avatar from './Avatar';
import { useSelector } from 'react-redux';

export const Header = () => {
  const { loading, error,name } = useSelector((state) => state.me);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1769aa" barStyle="light-content" />
      <View style={styles.headerContent}>
        <View>
   <View style={styles.view}>
   <Text style={styles.text}>Hi,</Text>
   <Text style={styles.text1}> {name}</Text>
   </View>
   <Text style={styles.text2}>Your Visits</Text>
   </View>
        <Avatar size={40} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#1769aa',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#125a91',
    paddingLeft: 20,
    paddingTop: 50,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',


  },
  text: {
    color: '#fff',
    fontSize: 25,
 
  },
  text1: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '900',
  },
  text2: {
    color: '#fff',
  fontStyle:'italic',
  paddingTop:8,
  fontSize:14,
  },
  view: {
    flexDirection: 'row',
  },
});