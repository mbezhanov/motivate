import React from 'react';
import renderer from 'react-test-renderer';
import snapshotDiff from 'snapshot-diff';
import NavToggle from '../NavToggle';

jest.mock('react-native/Libraries/Components/Touchable/TouchableWithoutFeedback', () => 'TouchableWithoutFeedback');

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  class Octicons extends React.Component {
    render() {
      return React.createElement('Octicons', this.props, this.props.children)
    }
  }
  return { Octicons };
});

describe('NavToggle', () => {
  let tree;

  beforeEach(() => {
    tree = renderer.create(<NavToggle />);
  });

  it('renders correctly', () => {
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('can use a custom onPress handler', () => {
    const stub = () => '123';
    const a = tree.toJSON();
    const b = renderer.create(<NavToggle onPress={stub} />).toJSON();
    const diff = snapshotDiff(a, b);
    expect(diff).toMatchSnapshot();
  });

  it('can use an externally animated value to perform a rotation animation', () => {
    const stub = {
      _children: [],
      _parent: 0,
      _config: {
        inputRange: [0, 1],
        outputRange: ['0deg', '225deg'],
      },
      _interpolation: () => {},
    };
    const a = tree.toJSON();
    const b = renderer.create(<NavToggle rotate={stub} />).toJSON();
    const diff = snapshotDiff(a, b);
    expect(diff).toMatchSnapshot();
  });
});
