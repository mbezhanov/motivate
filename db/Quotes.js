import { SQLite } from 'expo';

class Quotes {
  constructor() {
    this.db = SQLite.openDatabase('quotes.db');
    this.db.transaction(tx => {
      tx.executeSql('create table if not exists quotes (id integer primary key not null, content text, author text, book text, times_seen int default 0);');
    });
  }

  insert = (quote, author, book) => {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql('insert into quotes (content, author, book) values (?, ?, ?);', [quote, author, book], (tx, resultSet) => {
          resolve(resultSet.insertId);
        });
      }, error => reject(error));
    });

  };

  random = () => {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql('select * from quotes order by random() asc limit 1;', [], (tx, resultSet) => {
          const { rows: { _array }} = resultSet;
          const quote = _array.length > 0 ? _array[0] : null;

          if (quote) {
            quote.imageUrl = this._generateImageUrl(quote.content);
          }
          resolve(quote);
        });
      }, error => reject(error));
    });
  };

  _generateImageUrl = (quote) => {
    const MAX_ID = 1084;
    let sum = 0;

    for (let i = 0; i < quote.length; i++) {
      sum += quote.charCodeAt(i);
    }

    return `https://picsum.photos/480/960?image=${sum % MAX_ID}`;
  };
}

export default new Quotes();
