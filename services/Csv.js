import { DocumentPicker, FileSystem } from 'expo';
import Papa from 'papaparse';
import moment from 'moment';
import Quotes from './Quotes';

class Csv {
 importQuotes = () => {
   return DocumentPicker
     .getDocumentAsync()
     .then(document => {

       if (document.type !== 'success') {
         throw new Error('document import failed');
       }

       return FileSystem
         .readAsStringAsync(document.uri)
         .then(contents => Quotes.importCsv(Papa.parse(contents)).then(count => count));
     });
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
         .then(() => quotes.length);
    });
 }
}

export default new Csv();
