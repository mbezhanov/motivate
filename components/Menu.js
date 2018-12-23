import React, { Component } from 'react';
import { Alert, Animated, Easing, StyleSheet, View } from 'react-native';
import MenuButton from './MenuButton';
import NavToggle from './NavToggle';
import Sizes from '../constants/Sizes';
import Colors from '../constants/Colors';

const ANIMATION_DURATION = 200; // milliseconds;

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAnimating: false,
      isExpanded: false,
      rotation: new Animated.Value(0),
      slideIn: new Animated.Value(0),
    }
  }

  render() {
    const right = this.state.slideIn.interpolate({
      inputRange: [0, 1],
      outputRange: [Sizes.XL * 5 * -1, 8],
    });
    const rotate = this.state.rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '225deg'],
    });

    return (
      <View style={styles.container}>
        <Animated.View style={{ position: 'relative', right }}>
          <MenuButton key="add" label="Add" icon="plus" onPress={this._onAddButtonPress}/>
          <MenuButton key="edit" label="Edit" icon="pencil" onPress={this._onEditButtonPress}/>
          <MenuButton key="delete" label="Delete" icon="trashcan" onPress={this._onDeleteButtonPress}/>
        </Animated.View>
        <NavToggle onPress={this._onPlusButtonPress} rotate={rotate}/>
      </View>
    );
  }

  _onAddButtonPress = () => {
    this._toggleMenuItems(() => {
      this.props.navigation.push('Form', {
        headerTitle: 'Add Quote',
      });
    });
  };

  _onEditButtonPress = () => {
    this._toggleMenuItems(() => {
      this.props.navigation.push('Form', {
        quote: this.props.quote,
        headerTitle: 'Edit Quote',
      });
    });
  };

  _onDeleteButtonPress = () => {
    this._toggleMenuItems(() => {
      Alert.alert('Delete Quote', 'Are you sure you want to delete this quote?', [
        { text: 'OK', onPress: () => this.props.onDelete(this.props.quote.id) },
        { text: 'Cancel', style: 'cancel' },
      ]);
    })
  };

  _onPlusButtonPress = () => {
    this._toggleMenuItems();
  };

  _toggleMenuItems = (onAnimationEnd = () => {}) => {
    if (this.state.isAnimating) {
      return;
    }
    const toValue = 0 + !this.state.isExpanded;

    Animated.parallel([
      Animated.timing(this.state.rotation, {
        toValue,
        duration: ANIMATION_DURATION,
        easing: Easing.linear
      }),
      Animated.timing(this.state.slideIn, {
        toValue,
        duration: ANIMATION_DURATION,
        easing: Easing.linear,
      })
    ]).start(() => {
      this.setState({
        isAnimating: false,
        isExpanded: !this.state.isExpanded,
      }, () => {
        onAnimationEnd();
      });
    });
  };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Sizes.M,
    right: Sizes.M,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  button: {
    width: Sizes.L * 2,
    height: Sizes.L * 2,
    borderRadius: Sizes.L,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BACKGROUND,
    marginBottom: Sizes.S,
  },
});
