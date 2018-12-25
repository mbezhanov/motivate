import React, { Component } from 'react';
import { Image, ImageBackground, RefreshControl, StyleSheet, ScrollView, View } from 'react-native';
import StyledText from '../components/StyledText';
import Menu from '../components/Menu';
import Quote from '../components/Quote';
import Toast from '../components/Toast';
import Sizes from '../constants/Sizes';
import Quotes from '../services/Quotes';
import LoremPicsum from '../services/LoremPicsum';

class HomeScreen extends Component {

  static navigationOptions = { header: null };

  state = {
    loaded: false,
    quote: null,
    toast: null,
    imageUrl: LoremPicsum.getDefaultImage(),
  };

  render() {
    let quote;
    let toast;

    if (this.state.loaded) {
      quote = this.state.quote ? <Quote quote={this.state.quote} /> : <StyledText size={Sizes.XL}>Your collection is empty.</StyledText>;
    }

    if (this.state.toast) {
      toast = <Toast content={this.state.toast} transparent={true} onComplete={this._destroyToast}/>;
    }

    return (
      <ImageBackground source={{uri: this.state.imageUrl}}  style={{width: '100%', height: '100%'}}>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={!this.state.loaded}
              onRefresh={this._handleRefresh}
            />
          }
        >
          {quote}
          <View style={styles.toastContainer}>
            {toast}
          </View>
          <Menu
            quote={this.state.quote}
            navigation={this.props.navigation}
            onDelete={id => this._handleDelete(id)}
          />
        </ScrollView>
      </ImageBackground>
    );
  }

  componentDidMount() {
    this._displayRandomQuote();
  }

  _handleRefresh = () => {
    this.setState({ loaded: false }, () => {
      this._displayRandomQuote();
    });
  };

  _handleDelete = (id) => {
    Quotes
      .delete(id)
      .then(() => {
        this._displayRandomQuote();
      })
      .catch(() => {
        this.setState({
          loaded: true,
          toast: 'error',
        });
      });
  };

  _displayRandomQuote = () => {
    Quotes
      .random()
      .then(quote => {
        if (!quote) {
          this.setState({ loaded: true });
          return;
        }

        return Image
          .prefetch(quote.imageUrl)
          .then(() => {
            this.setState({
              quote,
              loaded: true,
              imageUrl: quote.imageUrl,
            });
          });

      })
      .catch(() => {
        this.setState({
          loaded: true,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastContainer: {
    flex: 0,
    width: '100%',
    position: 'absolute',
    top: '55%',
  }
});

export default HomeScreen;
