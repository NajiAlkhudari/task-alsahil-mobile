import React from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";

const { width } = Dimensions.get("window");

const LoadingSkeleton = () => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonItem = ({ style }) => (
    <Animated.View style={[styles.skeletonBase, { opacity }, style]} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.statisticsCard}>
        <View style={styles.statsRow}>
          {[1, 2, 3].map((_, index) => (
            <View key={index} style={styles.statItem}>
              <SkeletonItem style={styles.iconPlaceholder} />
              <SkeletonItem style={styles.labelPlaceholder} />
              <SkeletonItem style={styles.valuePlaceholder} />
              
            </View>
          ))}
        </View>
      </View>

      {[1, 2, 3,4].map((_, index) => (
        <View key={index} style={styles.reportCard}>
          <SkeletonItem style={styles.dateLine} />
          <View style={styles.cardContent}>
            <SkeletonItem style={styles.titlePlaceholder} />
            <SkeletonItem style={styles.textPlaceholder} />
            <SkeletonItem style={styles.textPlaceholder} />
            
            <SkeletonItem style={[styles.textPlaceholder, styles.amountPlaceholder]} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  skeletonBase: {
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
  statisticsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 20,
    height: 150,
    padding: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
    width: width * 0.25,
  },
  iconPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  labelPlaceholder: {
    width: 70,
    height: 16,
    marginTop: 8,
  },
  valuePlaceholder: {
    width: 50,
    height: 20,
    marginTop: 8,
  },
  reportCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    height: 120,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  dateLine: {
    width: 50,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  titlePlaceholder: {
    width: '80%',
    height: 20,
    marginBottom: 10,
  },
  textPlaceholder: {
    width: '60%',
    height: 15,
    marginBottom: 8,
  },
  amountPlaceholder: {
    width: '40%',
    marginTop: 5,
  },
});

export default LoadingSkeleton;