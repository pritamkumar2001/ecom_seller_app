import React, { useEffect, useRef } from 'react';
import {
  useWindowDimensions,
  View,
  Text,
  Animated,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { colors } from '../../Styles/appStyle';

const Loader = ({ visible = false }) => {
  const { width, height } = useWindowDimensions();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  if (!visible) return null;

  return (
    <View style={[styles.container, { height, width }]}>
      <Animated.View style={[styles.loader, { transform: [{ scale: pulseAnim }] }]}>
        <ActivityIndicator size="large" color={colors.blue} />
        <Text style={styles.loadingText}>Loading...</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 120,
    height: 120,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.blue,
  },
});

export default Loader;
