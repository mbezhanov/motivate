import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';

const plusButton = (props) => (
  <TouchableOpacity style={styles.button} onPress={props.onPress} activeOpacity={0.75}>
    <Octicons name="plus" size={Sizes.M} color={Colors.HIGHLIGHT} />
  </TouchableOpacity>
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

export default plusButton;
