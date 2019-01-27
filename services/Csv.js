import { Alert } from 'react-native';
import { DocumentPicker, FileSystem, MailComposer } from 'expo';
import Papa from 'papaparse';
import moment from 'moment';
import Quotes, { IMPORT_MODE_APPEND, IMPORT_MODE_OVERWRITE } from './Quotes';

class Csv {
 importQuotes = (shouldShowPrompt) => {
   return DocumentPicker
     .getDocumentAsync()
     .then(document => {

       if (document.type !== 'success') {
         throw new Error('document import failed');
       }

       return FileSystem
         .readAsStringAsync(document.uri)
         .then(contents => new Promise((resolve, reject) => {
           const onImportFinished = count => resolve(count);
           const onImportFailed = () => reject('CSV import failed.');

           if (!shouldShowPrompt) {
             // we don't need to show the "Overwrite or Append" prompt during the very first import!
              return this._doCsvImport(contents, IMPORT_MODE_APPEND, onImportFinished, onImportFailed);
           }
           Alert.alert('Import Settings', 'Would you like to append quotes to your existing collection or overwrite it completely?', [
             { text: 'Overwrite', onPress: () => this._doCsvImport(contents, IMPORT_MODE_OVERWRITE, onImportFinished, onImportFailed) },
             { text: 'Append', onPress: () => this._doCsvImport(contents, IMPORT_MODE_APPEND, onImportFinished, onImportFailed) }
           ]);
         }));
     });
 };

 _doCsvImport = (contents, importMode, onImportFinished, onImportFailed) => {
   return Quotes.importCsv(Papa.parse(contents), importMode).then(onImportFinished).catch(onImportFailed);
 };

 exportQuotes = () => {
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
 }
}

export default new Csv();
