import * as SQLite from 'expo-sqlite';
import LoremPicsum from './LoremPicsum';
import { shuffle } from 'lodash';

export const IMPORT_MODE_APPEND = 1;
export const IMPORT_MODE_OVERWRITE = 2;

let connection;

const db = () => {
  if (connection) {
    return connection;
  }
  connection = SQLite.openDatabase('quotes.db');
  connection.transaction(tx => {
    tx.executeSql('create table if not exists quotes (id integer primary key not null, content text, author text, book text, times_seen int default 0);');
    tx.executeSql('create index if not exists quotes_authors on quotes (author);');
    tx.executeSql('create index if not exists quotes_books on quotes (book);');
  });

  return connection;
};

const insert = (quote, author, book) => {
  return new Promise((resolve, reject) => {
    db().transaction(tx => {
      tx.executeSql('select min(times_seen) as minTimesSeen from quotes;', [], (tx, resultSet) => {
        const { rows: { _array }} = resultSet;
        const minTimesSeen = _array[0].minTimesSeen || 0;
        tx.executeSql('update quotes set times_seen = times_seen - ?;', [minTimesSeen]); // reset "times_seen" column
        tx.executeSql('insert into quotes (content, author, book, times_seen) values (?, ?, ?, ?);', [quote, author, book, 0], (tx, resultSet) => {
          resolve(resultSet.insertId);
        });
      });
    }, error => reject(error));
  });
};

const update = (id, quote, author, book) => {
  return new Promise((resolve, reject) => {
    db().transaction(tx => {
      tx.executeSql('update quotes set content = ?, author = ?, book = ? where id = ?;', [quote, author, book, id], (tx, resultSet) => {
        resolve(resultSet.rowsAffected);
      });
    }, error => reject(error));
  });
};

const remove = (id) => {
  return new Promise((resolve, reject) => {
    db().transaction(tx => {
      tx.executeSql('delete from quotes where id = ?;', [id], (tx, resultSet) => {
        resolve(resultSet.rowsAffected);
      });
    }, error => reject(error));
  });
};

const random = () => {
  return new Promise((resolve, reject) => {
    db().transaction(tx => {
      const columns = shuffle(['id', 'author', 'book']);
      const randomColumn = columns[0];
      const randomDirection = Math.round(Math.random()) ? 'asc' : 'desc';

      tx.executeSql(`select * from quotes order by times_seen asc, ${randomColumn} ${randomDirection} limit 1;`, [], (tx, resultSet) => {
        const { rows: { _array }} = resultSet;
        const quote = _array.length > 0 ? _array[0] : null;

        if (quote) {
          quote.imageUrl = LoremPicsum.getRandomImage(quote.content);
          tx.executeSql('update quotes set times_seen = times_seen + 1 where id = ?;', [quote.id], () => resolve(quote));
        } else {
          resolve(quote);
        }
      });
    }, error => reject(error));
  });
};

const importCsv = (csv, mode) => {
  return new Promise((resolve, reject) => {
    let rowsAffected = 0;
    db().transaction(tx => {
      let minTimesSeen = 0;

      if (mode === IMPORT_MODE_OVERWRITE) {
        tx.executeSql('delete from quotes;');
      }
      tx.executeSql('select min(times_seen) as minTimesSeen from quotes;', [], (tx, resultSet) => {
        const { rows: { _array }} = resultSet;
        minTimesSeen = _array[0].minTimesSeen || 0;
      });

      // reset "times_seen" column if necessary
      tx.executeSql('update quotes set times_seen = times_seen - ?;', [minTimesSeen]);

      // import quotes from CSV file
      csv.data.forEach(row => {
        const content = row[0];
        const author = row[1];
        const book = row[2];
        const timesSeen = row[3] || 0;

        if (!content || !author || !book) {
          return;
        }

        tx.executeSql('insert into quotes (content, author, book, times_seen) values (?, ?, ?, ?);', [content, author, book, timesSeen], (tx, resultSet) => {
          rowsAffected += resultSet.rowsAffected;
        });
      });
    }, error => reject(error), () => resolve(rowsAffected));
  });
};

const exportCsv = () => {
  return new Promise((resolve, reject) => {
    db().transaction(tx => {
      tx.executeSql('select content, author, book, times_seen from quotes order by id asc;', [], (tx, resultSet) => {
        const { rows: { _array }} = resultSet;
        resolve(_array);
      });
    }, error => reject(error));
  });
};

export default {
  db,
  insert,
  update,
  remove,
  random,
  importCsv,
  exportCsv,
}
