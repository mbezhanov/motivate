import React from 'react';
import { Alert } from 'react-native';
import renderer from 'react-test-renderer';
import snapshotDiff from 'snapshot-diff';
import Menu from '../Menu';
import MenuButton from '../MenuButton';
import NavToggle from '../NavToggle';
import Csv from '../../services/Csv';

jest.mock('../MenuButton', () => 'MenuButton');
jest.mock('../NavToggle', () => 'NavToggle');

jest.mock('Animated', () => {
  const ActualAnimated = jest.requireActual('Animated');
  return {
    ...ActualAnimated,
    timing: (value, config) => {
      return { value, config };
    },
    parallel: (animations) => {
      return {
        start: (callback) => {
          for (let i in animations) {
            let animation = animations[i];
            animation.value.setValue(animation.config.toValue);
          }
          callback && callback();
        },
      };
    },
  };
});
jest.mock('../../services/Csv');
jest.mock('Alert', () => ({ alert: jest.fn() }));

const _press = (component) => {
  component.props.onPress(); // simulate press on component
};

const _toggleSubmenu = (treeRoot) => {
  const navToggle = treeRoot.findByType(NavToggle);
  _press(navToggle);
};

describe('Menu', () => {
  let tree;
  let navigation;
  const quote = { id: 123, content: 'foo', author: 'bar', book: 'baz' };
  const onDelete = jest.fn();
  const onSuccessfulImport = jest.fn();

  beforeEach(() => {
    navigation = { push: jest.fn() };
    tree = renderer.create(
      <Menu
        navigation={navigation}
        quote={quote}
        onDelete={onDelete}
        onSuccessfulImport={onSuccessfulImport}
      />
    );
    Alert.alert.mockClear();
  });

  it('renders correctly', () => {
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('displays all hidden submenu items when the nav toggle switch is pressed', () => {
    const a = tree.toJSON();
    const navToggle = tree.root.findByType(NavToggle);
    _press(navToggle);
    const b = tree.toJSON();
    const diff = snapshotDiff(a, b);
    expect(diff).toMatchSnapshot();
  });

  it('hides all displayed submenu items when the nav toggle switch is pressed', () => {
    const navToggle = tree.root.findByType(NavToggle);
    _press(navToggle); // open submenu items
    const a = tree.toJSON();
    _press(navToggle); // close submenu items
    const b = tree.toJSON();
    const diff = snapshotDiff(a, b);
    expect(diff).toMatchSnapshot();
  });

  it('delegates control to the CSV service when an import is requested', async () => {
    _toggleSubmenu(tree.root);
    Csv.importQuotes.mockResolvedValueOnce(123);
    const a = tree.toJSON();
    const importButton = tree.root.findByProps({ label: 'Import' });
    await _press(importButton);
    const b = tree.toJSON();
    const diff = snapshotDiff(a, b);
    expect(Alert.alert).toBeCalledTimes(1);
    expect(Alert.alert.mock.calls[0][0]).toEqual('Success');
    expect(Alert.alert.mock.calls[0][1].indexOf('123')).not.toEqual(-1);
    expect(diff).toMatchSnapshot();
  });

  it('displays an error message if the CSV import fails', async () => {
    _toggleSubmenu(tree.root);
    Csv.importQuotes.mockRejectedValueOnce();
    const importButton = tree.root.findByProps({ label: 'Import' });
    await _press(importButton);
    expect(Alert.alert).toBeCalledTimes(1);
    expect(Alert.alert.mock.calls[0][0]).toEqual('Error');
  });

  it('raises an event if the CSV import is successful', async () => {
    Csv.importQuotes.mockResolvedValueOnce(123);
    const importButton = tree.root.findByProps({ label: 'Import' });
    await _press(importButton);
    expect(Alert.alert).toBeCalledTimes(1);
    const okButton = Alert.alert.mock.calls[0][2][0];
    okButton.onPress();
    expect(onSuccessfulImport).toBeCalledTimes(1);
  });

  it('delegates control to the CSV service when an export is requested', async () => {
    Csv.exportQuotes.mockResolvedValueOnce(123);
    const a = tree.toJSON();
    const exportButton = tree.root.findByProps({ label: 'Export' });
    await _press(exportButton);
    const b = tree.toJSON();
    const diff = snapshotDiff(a, b);
    expect(Alert.alert).toBeCalledTimes(1);
    expect(Alert.alert.mock.calls[0][0]).toEqual('Success');
    expect(Alert.alert.mock.calls[0][1].indexOf('123')).not.toEqual(-1);
    expect(diff).toMatchSnapshot();
  });

  it('displays an error message if the CSV export fails', async () => {
    Csv.exportQuotes.mockRejectedValueOnce();
    const exportButton = tree.root.findByProps({ label: 'Export' });
    await _press(exportButton);
    expect(Alert.alert).toBeCalledTimes(1);
    expect(Alert.alert.mock.calls[0][0]).toEqual('Error');
  });

  it('navigates to the Form screen when the insertion of a new quote is requested', () => {
    const addButton = tree.root.findByProps({ label: 'Add' });
    _press(addButton);
    expect(navigation.push).toBeCalledTimes(1);
    expect(navigation.push.mock.calls[0][0]).toEqual('Form');
  });

  it('navigates to the Form screen when the update of an existing quote is requested', () => {
    const editButton = tree.root.findByProps({ label: 'Edit' });
    _press(editButton);
    expect(navigation.push).toBeCalledTimes(1);
    expect(navigation.push.mock.calls[0][0]).toEqual('Form');
    expect(navigation.push.mock.calls[0][1].quote).toEqual(quote);
  });

  it('asks the user for confirming the intention of deleting a particular quote', () => {
    const deleteButton = tree.root.findByProps({ label: 'Delete' });
    _press(deleteButton);
    expect(Alert.alert).toBeCalledTimes(1);
    expect(Alert.alert.mock.calls[0][0].indexOf('Delete')).not.toEqual(-1);
  });

  it('raises an event if the user confirms the intention of deleting a particular quote', () => {
    const deleteButton = tree.root.findByProps({ label: 'Delete' });
    _press(deleteButton);
    expect(Alert.alert).toBeCalledTimes(1);
    const okButton = Alert.alert.mock.calls[0][2][0];
    okButton.onPress();
    expect(onDelete).toBeCalledTimes(1);
  });
});
