import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';

const strokedText = props => (
  <View style={{ ...styles.container, ...props.style }}>
    <View style={styles.textWrapper}>
      <Text style={[styles.outline, { fontSize: props.size }]}>{props.children}</Text>
      <Text style={[styles.text, { fontSize: props.size }]}>{props.children}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    margin: Sizes.M,
    alignItems: 'center',
  },
  textWrapper: {
    position: 'relative',
  },
  text: {
    color: Colors.HIGHLIGHT,
    textAlign: 'center',
  },
  outline: {
    color: Colors.OUTLINE,
    position: 'absolute',
    top: 2,
    left: 2,
    textAlign: 'center',
  }
});

export default strokedText;
