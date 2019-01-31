import { FileSystem, MailComposer } from 'expo';
import Papa from 'papaparse';
import moment from 'moment';
import Quotes from './Quotes';

const importQuotes = (documentUri, importMode) => {
  return FileSystem
    .readAsStringAsync(documentUri)
    .then(contents => new Promise((resolve, reject) => {
      const onImportFinished = count => resolve(count);
      const onImportFailed = () => reject('CSV import failed.');

      return Quotes.importCsv(Papa.parse(contents), importMode).then(onImportFinished).catch(onImportFailed);
    }));
};

const exportQuotes = () => {
  return Quotes
    .exportCsv()
    .then(quotes => {
      if (!Array.isArray(quotes) || quotes.length === 0) {
        throw new Error('document export failed');
      }
      const fileUri = `${FileSystem.documentDirectory}export-${moment().format('YYYY-MM-DD-HH-mm-ss')}.csv`;

      return FileSystem
        .writeAsStringAsync(fileUri, Papa.unparse(quotes))
        .then(() => {
          return MailComposer
            .composeAsync({
              subject: 'exported quotes',
              body: `Quotes exported on ${moment().format('YYYY-MM-DD-HH-mm-ss')}`,
              attachments: [fileUri]
            })
            .then(() => quotes.length);
        });
  });
};

export default { importQuotes, exportQuotes };
