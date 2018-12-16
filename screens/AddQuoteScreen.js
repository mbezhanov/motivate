import React, { Component } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import StyledInput from '../components/StyledInput';
import SubmitButton from '../components/SubmitButton';
import Toast from '../components/Toast';
import Colors from '../constants/Colors';
import Quotes from '../db/Quotes';

const initialState = {
  author: null,
  book: null,
  quote: null,
  toast: null,
};

export default class AddQuoteScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      backgroundColor: Colors.BACKGROUND,
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: Colors.TEXT,
    headerTitle: 'Add Quote',
    headerRight: <SubmitButton onPress={(navigation.state.params || {}).onSubmit}/>
  });

  state = {...initialState, showToast: false};

  render() {
    let toast;

    if (this.state.toast) {
      toast = <Toast content={this.state.toast} onComplete={this._destroyToast}/>;
    }

    return (
      <ScrollView style={styles.container}>
        <View style={styles.formWrapper}>
          <StyledInput label="Author" value={this.state.author} onChangeText={author => this.setState({ author })} />
          <StyledInput label="Book" value={this.state.book}  onChangeText={book => this.setState({ book })} />
          <StyledInput label="Quote" value={this.state.quote}  onChangeText={quote => this.setState({ quote })} multiline={true}/>
          {toast}
        </View>
      </ScrollView>
    );
  }

  componentDidMount() {
    this.props.navigation.setParams({ onSubmit: this._submitForm });
  }

  _submitForm = () => {
    Keyboard.dismiss();
    Quotes
      .insert(this.state.quote, this.state.author, this.state.book)
      .then(() => {
        this.setState({
          ...initialState,
          toast: 'quote added',
        });
      })
      .catch(() => {
        this.setState({
          ...initialState,
          toast: 'error',
        });
      });
  };

  _destroyToast = () => {
    this.setState({ toast: null });
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BACKGROUND,
  },
  formWrapper: {
    flex: 1,
  }
});
