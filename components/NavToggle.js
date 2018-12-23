import React from "react";
import {Animated, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';

const navToggle = ({ onPress, rotate }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.button}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Octicons name="plus" size={Sizes.M} color={Colors.HIGHLIGHT}  />
      </Animated.View>
    </View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  button: {
    width: Sizes.XL * 2,
    height: Sizes.XL * 2,
    borderRadius: Sizes.XL,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BACKGROUND,
  }
});

export default navToggle;
