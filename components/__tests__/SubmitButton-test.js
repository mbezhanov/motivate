import React from 'react';
import renderer from 'react-test-renderer';
import SubmitButton from '../SubmitButton';

jest.mock('react-native/Libraries/Components/Touchable/TouchableOpacity', () => 'TouchableOpacity');

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  class Octicons extends React.Component {
    render() {
      return React.createElement('Octicons', this.props, this.props.children)
    }
  }
  return { Octicons };
});

describe('SubmitButton', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<SubmitButton />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('can use a custom onPress handler', () => {
    const stub = () => '123';
    const tree = renderer.create(<SubmitButton onPress={stub} />).toJSON();
    expect(tree.props.onPress).toEqual(stub);
  });
});
