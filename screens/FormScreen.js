import React, { Component } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import StyledInput from '../components/StyledInput';
import SubmitButton from '../components/SubmitButton';
import Toast from '../components/Toast';
import Colors from '../constants/Colors';
import Quotes from '../services/Quotes';
import LoremPicsum from '../services/LoremPicsum';
import { updateLoadedQuote } from '../store/actions/quotes';

const initialState = {
  id: null,
  author: null,
  book: null,
  quote: null,
  toast: null,
};

class FormScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      backgroundColor: Colors.BACKGROUND,
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: Colors.TEXT,
    headerTitle: navigation.state.params.headerTitle,
    headerRight: <SubmitButton onPress={(navigation.state.params || {}).onSubmit}/>
  });

  state = { ...initialState };

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

    if (this.props.navigation.state.params && this.props.navigation.state.params.quote) {
      const quote = this.props.navigation.state.params.quote;
      this.setState({
        id: quote.id,
        author: quote.author,
        book: quote.book,
        quote: quote.content,
      });
    }
  }

  _submitForm = () => {
    Keyboard.dismiss();

    if (this.state.id) {
      this._updateQuote();
    } else {
      this._insertQuote();
    }
  };

  _insertQuote = () => {
    Quotes
      .insert(this.state.quote, this.state.author, this.state.book)
      .then(id => {
        this.props.updateLoadedQuote({
          id: id,
          content: this.state.quote,
          author: this.state.author,
          book: this.state.book,
          imageUrl: LoremPicsum.getRandomImage(this.state.quote),
        });
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

  _updateQuote = () => {
    Quotes
      .update(this.state.id, this.state.quote, this.state.author, this.state.book)
      .then(() => {
        this.props.updateLoadedQuote({
          id: this.state.id,
          content: this.state.quote,
          author: this.state.author,
          book: this.state.book,
        });
        this.setState({
          toast: 'quote updated',
        });
      })
      .catch(() => {
        this.setState({
          toast: 'error',
        });
      });
  };

  _destroyToast = () => {
    this.setState({ toast: null });
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BACKGROUND,
  },
  formWrapper: {
    flex: 1,
  }
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateLoadedQuote: quote => dispatch(updateLoadedQuote(quote)),
  }
};

export default connect(null, mapDispatchToProps)(FormScreen);
