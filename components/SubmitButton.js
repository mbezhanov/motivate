import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';

const submitButton = (props) => (
  <TouchableOpacity style={styles.button} onPress={props.onPress}>
    <Octicons name="check" size={Sizes.L} color={Colors.HIGHLIGHT} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    marginRight: Sizes.M
  }
});

export default submitButton;
