import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '../constants/Colors';
import Sizes from '../constants/Sizes';

class StyledInput extends Component {

  state = { focused: false };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{this.props.label}</Text>
        <TextInput
          style={[styles.textInput, this.state.focused ? styles.focused : null]}
          underlineColorAndroid="transparent"
          onFocus={this._handleFocus}
          onBlur={this._handleBlur}
          multiline={this.props.multiline}
          value={this.props.value}
          onChangeText={this.props.onChangeText}
        />
      </View>
    );
  };

  _handleFocus = () => {
    this.setState({ focused: true });
  };

  _handleBlur = () => {
    this.setState({ focused: false });
  };
}

StyledInput.defaultProps = { multiline: false };

const styles = StyleSheet.create({
  container: {
    margin: Sizes.M,
  },
  label: {
    color: Colors.TEXT,
    fontSize: Sizes.S,
  },
  textInput: {
    color: Colors.TEXT,
    borderBottomWidth: 1,
    borderColor: Colors.BORDER,
    fontSize: Sizes.M,
    marginTop: Sizes.S,
  },
  focused: {
    borderColor: Colors.TEXT,
  }
});

export default StyledInput;
