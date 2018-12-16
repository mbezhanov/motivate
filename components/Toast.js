import React, { Component } from 'react';
import { StyleSheet, Text, Animated } from 'react-native';
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';

const ANIMATION_DURATION = 600; // milliseconds;
const TOAST_DURATION = 2000; // milliseconds

export default class Toast extends Component {
  state = {
    opacity: new Animated.Value(0),
  };

  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: ANIMATION_DURATION,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
        }).start(() => {
          this.props.onComplete();
        });
      }, TOAST_DURATION);
    });
  }

  render() {
    const backgroundColor = this.props.transparent ? 'rgba(0, 0, 0, 0.5)' : Colors.BORDER;

    return (
      <Animated.View style={{...styles.container, opacity: this.state.opacity, backgroundColor }}>
        <Text style={styles.text}>{this.props.content}</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '33%',
    borderRadius: Sizes.M,
    padding: Sizes.M / 2,
    margin: Sizes.M,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  text: {
    color: Colors.TEXT,
    fontSize: Sizes.M
  }
});
