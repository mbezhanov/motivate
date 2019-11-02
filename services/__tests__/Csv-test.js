import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';
import Quotes, { IMPORT_MODE_APPEND, IMPORT_MODE_OVERWRITE } from '../Quotes';
import Csv from '../Csv';

const serializedQuotes = 'content,author,book,times_seen\r\nfoo,bar,baz,123\r\nlorem,ipsum,dolor,456\r\nalpha,beta,gamma,789';
const quotes = [
  { content: 'foo', author: 'bar', book: 'baz', times_seen: 123 },
  { content: 'lorem', author: 'ipsum', book: 'dolor', times_seen: 456 },
  { content: 'alpha', author: 'beta', book: 'gamma', times_seen: 789 },
];
const documentUri = 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540mbezhanov%252Fmotivate/DocumentPicker/9e018921-301a-4c0b-9869-f69db3ed760fcsv';
const importedDocumentContents = 'Quote 1;AAuthor;Zbook\n' +
  'Quote 2;BAuthor;Ybook\n' +
  'Quote 3;CAuthor;Xbook\n';

jest.mock('../Quotes');
jest.mock('expo', () => ({
  FileSystem: {
    readAsStringAsync: jest.fn(),
    writeAsStringAsync: jest.fn(() => Promise.resolve()),
    documentDirectory: 'file:///data/user/0/',
  },
  MailComposer: {
    composeAsync: jest.fn(() => Promise.resolve()),
  },
}));
jest.mock('moment', () => () => ({
  format: () => '2009-02-14-01-31-38', // mock today's date
}));

const _performCsvImport = async (importMode) => {
  FileSystem.readAsStringAsync.mockResolvedValueOnce(importedDocumentContents);
  Quotes.importCsv.mockClear();
  Quotes.importCsv.mockResolvedValueOnce();
  await Csv.importQuotes(documentUri, importMode);
};

describe('Csv service', () => {
  it('coordinates the import of quotes into the database', async () => {
    await _performCsvImport(IMPORT_MODE_APPEND);
    expect(FileSystem.readAsStringAsync).toBeCalledTimes(1);
    expect(FileSystem.readAsStringAsync.mock.calls[0][0]).toEqual(documentUri);
  });

  it('can pass different import modes to the Quotes service', async () => {
    await _performCsvImport(IMPORT_MODE_APPEND);
    expect(Quotes.importCsv.mock.calls[0][1]).toEqual(IMPORT_MODE_APPEND);
    await _performCsvImport(IMPORT_MODE_OVERWRITE);
    expect(Quotes.importCsv.mock.calls[0][1]).toEqual(IMPORT_MODE_OVERWRITE);
  });

  it('coordinates the export of quotes from the database', async () => {
    Quotes.exportCsv.mockResolvedValueOnce(quotes);
    const exportedQuotes = await Csv.exportQuotes();
    expect(exportedQuotes).toEqual(quotes.length);

    // ensure exported file is written on device:
    const expectedFileUrl = 'file:///data/user/0/export-2009-02-14-01-31-38.csv';
    expect(FileSystem.writeAsStringAsync).toBeCalledTimes(1);
    expect(FileSystem.writeAsStringAsync.mock.calls[0][0]).toEqual(expectedFileUrl);
    expect(FileSystem.writeAsStringAsync.mock.calls[0][1]).toEqual(serializedQuotes);

    // ensure exported file is attached by mail:
    expect(MailComposer.composeAsync).toBeCalledTimes(1);
    expect(MailComposer.composeAsync.mock.calls[0][0].attachments[0]).toEqual(expectedFileUrl);
  });
});
