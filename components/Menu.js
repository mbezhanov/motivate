import React, { Component } from 'react';
import { Alert, Animated, Easing, StyleSheet, View } from 'react-native';
import { DocumentPicker } from 'expo';
import MenuButton from './MenuButton';
import NavToggle from './NavToggle';
import Sizes from '../constants/Sizes';
import Colors from '../constants/Colors';
import Csv from '../services/Csv';
import { IMPORT_MODE_APPEND, IMPORT_MODE_OVERWRITE } from '../services/Quotes';
import PropTypes from 'prop-types';

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
          <MenuButton key="import" label="Import" icon="download" onPress={this._onImportButtonPress}/>
          <MenuButton key="export" label="Export" icon="upload" onPress={this._onExportButtonPress}/>
          <MenuButton key="add" label="Add" icon="plus" onPress={this._onAddButtonPress}/>
          <MenuButton key="edit" label="Edit" icon="pencil" onPress={this._onEditButtonPress}/>
          <MenuButton key="delete" label="Delete" icon="trashcan" onPress={this._onDeleteButtonPress}/>
        </Animated.View>
        <NavToggle onPress={this._onPlusButtonPress} rotate={rotate}/>
      </View>
    );
  }

  _onImportButtonPress = () => {
    this._toggleMenuItems(() => {
      const onImportSuccess = (count) => {
        Alert.alert('Success', `Imported ${count} quotes.`, [
          { text: 'OK', onPress: () => this.props.onSuccessfulImport() },
        ]);
      };
      const onImportFail = () => {
        Alert.alert('Error', 'An error occurred.');
      };
      DocumentPicker
        .getDocumentAsync()
        .then(document => {

          if (document.type === 'cancel') {
            Alert.alert('Import canceled', '');
            return;
          }
          const shouldShowPrompt = (this.props.quote !== null);

          if (shouldShowPrompt) {
            Alert.alert('Import Settings', 'Would you like to append quotes to your existing collection or overwrite it completely?', [
              { text: 'Overwrite', onPress: () => Csv.importQuotes(document.uri, IMPORT_MODE_OVERWRITE).then(onImportSuccess).catch(onImportFail) },
              { text: 'Append', onPress: () => Csv.importQuotes(document.uri, IMPORT_MODE_APPEND).then(onImportSuccess).catch(onImportFail) }
            ]);
          } else {
            Csv.importQuotes(document.uri, IMPORT_MODE_APPEND).then(onImportSuccess).catch(onImportFail);
          }
        });
    });
  };

  _onExportButtonPress = () => {
    this._toggleMenuItems(() => {
      Csv
        .exportQuotes()
        .then(count => {
          Alert.alert('Success', `Exported ${count} quotes.`);
        })
        .catch(() => {
          Alert.alert('Error', 'An error occurred.');
        });
    });
  };

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
        { text: 'OK', onPress: () => this.props.onDelete() },
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

Menu.propTypes = {
  quote: PropTypes.shape({
    id: PropTypes.number,
    author: PropTypes.string,
    book: PropTypes.string,
    content: PropTypes.string,
    imageUrl: PropTypes.string,
    times_seen: PropTypes.number,
  }),
  navigation: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSuccessfulImport: PropTypes.func.isRequired,
};

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
