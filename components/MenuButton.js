import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import StyledText from './StyledText';
import Sizes from "../constants/Sizes";
import Colors from '../constants/Colors';

const button = (props) => (
  <View style={styles.container}>
    <View style={styles.textContainer}>
      <StyledText>{props.label}</StyledText>
    </View>
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Octicons name={props.icon} size={Sizes.M} color={Colors.HIGHLIGHT} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: Sizes.L / 2,
    flexDirection: 'row',
  },
  button: {
    width: Sizes.L * 2,
    height: Sizes.L * 2,
    borderRadius: Sizes.L,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BACKGROUND,
  },
  textContainer: {
    height: Sizes.L * 2,
    borderRadius: Sizes.L,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default button;
