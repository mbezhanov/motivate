import React from 'react';
import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import renderer from 'react-test-renderer';
import snapshotDiff from 'snapshot-diff';
import Menu from '../Menu';
import MenuButton from '../MenuButton';
import NavToggle from '../NavToggle';
import Csv from '../../services/Csv';
import { IMPORT_MODE_APPEND, IMPORT_MODE_OVERWRITE } from '../../services/Quotes';

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
jest.mock('expo', () => ({
  DocumentPicker: {
    getDocumentAsync: jest.fn(),
  },
}));
jest.mock('../../services/Csv');
jest.mock('../../services/Quotes');
jest.mock('Alert', () => ({ alert: jest.fn() }));

const _press = (component) => {
  component.props.onPress(); // simulate press on component
};

const _toggleSubmenu = (treeRoot) => {
  const navToggle = treeRoot.findByType(NavToggle);
  _press(navToggle);
};

const mockImportedDocument = {
  name: 'test.csv',
  size: 64,
  type: 'success',
  uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540mbezhanov%252Fmotivate/DocumentPicker/9e018921-301a-4c0b-9869-f69db3ed760fcsv'
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
    Csv.importQuotes.mockClear();
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

  it('lets the user pick a document when an import is requested', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValueOnce(mockImportedDocument);
    Csv.importQuotes.mockResolvedValueOnce(123);
    _toggleSubmenu(tree.root);
    const a = tree.toJSON();
    const importButton = tree.root.findByProps({ label: 'Import' });
    await _press(importButton);
    expect(DocumentPicker.getDocumentAsync).toBeCalledTimes(1);
    const b = tree.toJSON();
    const diff = snapshotDiff(a, b);
    expect(diff).toMatchSnapshot();
  });

  it('directly delegates control to the CSV service if the database is empty', async () => {
    tree = renderer.create(
      <Menu
        navigation={navigation}
        quote={null}
        onDelete={onDelete}
        onSuccessfulImport={onSuccessfulImport}
      />
    );
    DocumentPicker.getDocumentAsync.mockResolvedValueOnce(mockImportedDocument);
    Csv.importQuotes.mockResolvedValueOnce(123);
    _toggleSubmenu(tree.root);
    const importButton = tree.root.findByProps({ label: 'Import' });
    await _press(importButton);
    expect(Csv.importQuotes).toBeCalledTimes(1);
  });

  it('asks the user whether new quotes should be appended to or overwrite the existing collection, if the database is not empty', async () => {
    _toggleSubmenu(tree.root);
    DocumentPicker.getDocumentAsync.mockResolvedValueOnce(mockImportedDocument);
    Csv.importQuotes.mockResolvedValueOnce(123);
    const importButton = tree.root.findByProps({ label: 'Import' });
    await _press(importButton);
    expect(Alert.alert).toBeCalledTimes(1);
    expect(Alert.alert.mock.calls[0][2][0].text).toEqual('Overwrite');
    expect(Alert.alert.mock.calls[0][2][1].text).toEqual('Append');
  });

  it('can instruct the Csv service to overwrite the existing collection', async () => {
    _toggleSubmenu(tree.root);
    DocumentPicker.getDocumentAsync.mockResolvedValueOnce(mockImportedDocument);
    Csv.importQuotes.mockResolvedValueOnce(123);
    const importButton = tree.root.findByProps({ label: 'Import' });
    await _press(importButton);
    Alert.alert.mock.calls[0][2][0].onPress();
    expect(Csv.importQuotes).toBeCalledTimes(1);
    expect(Csv.importQuotes.mock.calls[0][0]).toEqual(mockImportedDocument.uri);
    expect(Csv.importQuotes.mock.calls[0][1]).toEqual(IMPORT_MODE_OVERWRITE);
  });

  it('can instruct the Csv service to append new quotes to the existing collection', async () => {
    _toggleSubmenu(tree.root);
    DocumentPicker.getDocumentAsync.mockResolvedValueOnce(mockImportedDocument);
    Csv.importQuotes.mockResolvedValueOnce(123);
    const importButton = tree.root.findByProps({ label: 'Import' });
    await _press(importButton);
    Alert.alert.mock.calls[0][2][1].onPress();
    expect(Csv.importQuotes).toBeCalledTimes(1);
    expect(Csv.importQuotes.mock.calls[0][0]).toEqual(mockImportedDocument.uri);
    expect(Csv.importQuotes.mock.calls[0][1]).toEqual(IMPORT_MODE_APPEND);
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
