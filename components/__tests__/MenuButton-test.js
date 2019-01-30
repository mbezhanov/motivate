import React from 'react';
import renderer from 'react-test-renderer';
import snapshotDiff from 'snapshot-diff';
import MenuButton from '../MenuButton';

jest.mock('TouchableOpacity', () => 'TouchableOpacity');
jest.mock('../StyledText', () => 'StyledText');
jest.mock('@expo/vector-icons', () => {
  const React = require('React');
  class AntDesign extends React.Component {
    render() {
      return React.createElement('AntDesign', this.props, this.props.children)
    }
  }
  class Octicons extends React.Component {
    render() {
      return React.createElement('Octicons', this.props, this.props.children)
    }
  }
  return { AntDesign, Octicons };
});

describe('MenuButton', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<MenuButton label="foo" icon="bar" onPress={() => {}} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('uses a different icon set for the "upload" and "download" icons', () => {
    const a = renderer.create(<MenuButton label="foo" icon="bar" onPress={() => {}} />).toJSON();
    const b = renderer.create(<MenuButton label="foo" icon="upload" onPress={() => {}} />).toJSON();
    const c = renderer.create(<MenuButton label="foo" icon="download" onPress={() => {}} />).toJSON();
    let diff = snapshotDiff(a, b);
    expect(diff).toMatchSnapshot();
    diff = snapshotDiff(a, c);
    expect(diff).toMatchSnapshot();
  });
});
