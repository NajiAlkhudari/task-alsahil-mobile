import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Animated } from "react-native";

const FormSkeleton = () => {
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
      {/* Client Dropdown Skeleton */}
      <View style={styles.fieldContainer}>
        <SkeletonItem style={styles.label} />
        <SkeletonItem style={styles.input} />
      </View>

      {/* Tasks Dropdown Skeleton */}
      <View style={styles.fieldContainer}>
        <SkeletonItem style={styles.label} />
        <SkeletonItem style={styles.input} />
        {/* Selected Tasks Skeleton */}
        <View style={styles.selectedTasksContainer}>
          {[1, 2].map((_, index) => (
            <SkeletonItem key={index} style={styles.taskChip} />
          ))}
        </View>
      </View>

      {/* Amount Input Skeleton */}
      <View style={styles.fieldContainer}>
        <SkeletonItem style={styles.label} />
        <SkeletonItem style={styles.input} />
      </View>

      {/* Notes Input Skeleton */}
      <View style={styles.fieldContainer}>
        <SkeletonItem style={styles.label} />
        <SkeletonItem style={styles.textArea} />
      </View>

      {/* Submit Button Skeleton */}
      <View style={styles.buttonContainer}>
        <SkeletonItem style={styles.button} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fafafa",
  },
  skeletonBase: {
    backgroundColor: '#E1E9EE',
    borderRadius: 8,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    height: 20,
    width: 100,
    marginBottom: 8,
  },
  input: {
    height: 50,
    width: '100%',
    borderRadius: 8,
  },
  textArea: {
    height: 70,
    width: '100%',
    borderRadius: 8,
  },
  selectedTasksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 10,
  },
  taskChip: {
    height: 36,
    width: 120,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    height: 48,
    width: '100%',
    borderRadius: 8,
  },
});

export default FormSkeleton;