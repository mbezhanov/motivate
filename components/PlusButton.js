import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';

const plusButton = (props) => (
  <TouchableOpacity style={styles.button} onPress={props.onPress}>
    <Octicons name="plus" size={Sizes.M} color={Colors.TEXT} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: Sizes.M,
    right: Sizes.M,
    width: Sizes.XL * 2,
    height: Sizes.XL * 2,
    borderRadius: Sizes.XL,
    textAlign: 'center',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BACKGROUND,
  }
});

export default plusButton;
