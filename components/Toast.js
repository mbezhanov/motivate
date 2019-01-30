import React, { Component } from 'react';
import { StyleSheet, Text, Animated } from 'react-native';
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';
import PropTypes from 'prop-types';

const ANIMATION_DURATION = 600; // milliseconds;
const TOAST_DURATION = 2000; // milliseconds

export default class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
    };
    this.fadeOutTimeout = null;
  }

  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: ANIMATION_DURATION,
    }).start(() => {
      this.fadeOutTimeout = setTimeout(() => {
        Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
        }).start(() => {
          this.props.onComplete();
        });
      }, TOAST_DURATION);
    });
  }

  componentWillUnmount() {
    clearTimeout(this.fadeOutTimeout);
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

Toast.propTypes = {
  content: PropTypes.string.isRequired,
  transparent: PropTypes.bool,
  onComplete: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    width: '40%',
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
