import Quotes, { IMPORT_MODE_OVERWRITE, IMPORT_MODE_APPEND } from '../Quotes';

jest.mock('expo', () => ({
  SQLite: {
    openDatabase: () => {
      const sqlite3 = require('sqlite3').verbose();
      const db = new sqlite3.Database(':memory:');
      const tx = {
        executeSql: (sqlStatement, args, onSuccess, onError) => {
          const callback = (error, rows) => {
            const resultSet = {
              rows: { _array: rows },
              rowsAffected: 1, // stubbed it
            };

            if (!error) {
              onSuccess && onSuccess(tx, resultSet);
            } else {
              onError && onError();
            }
          };
          db.all(sqlStatement, args, callback);
        },
      };

      return {
        transaction: async (callback, onError, onSuccess) => {
          await db.serialize(() => {
            callback(tx);
          });
          onSuccess && onSuccess();
        }
      }
    }
  }
}));

const fakePapaparsedCsv = {
  data: [
    ['Quote 1', 'Aauthor', 'Zbook'],
    ['Quote 2', 'Bauthor', 'Ybook'],
    ['Quote 3', 'Cauthor', 'Xbook'],
    [], // ensure empty row is ignored
  ],
};

const expectInDatabase = (checkExpectations) => {
  return Quotes.db().transaction(tx => {
    tx.executeSql('select * from quotes', [], (tx, resultSet) => {
      const { rows: { _array }} = resultSet;
      checkExpectations(_array);
    });
  });
};

describe('Quotes service', () => {
  // NB: the database is not reset and re-populated between the different tests!!!
  // this means that when a test modifies the database, the modifications will affect all remaining tests

  it('can insert quotes into the database', async () => {
    await Quotes.insert('foo', 'bar', 'baz');
    await Quotes.insert('alpha', 'beta', 'gamma');
    await Quotes.insert('red', 'green', 'blue');
    await expectInDatabase(rows => {
      expect(rows.length).toEqual(3);
      expect(rows[0]).toEqual({
        id: 1,
        content: 'foo',
        author: 'bar',
        book: 'baz',
        times_seen: 0,
      });
    });
  });

  it('can update quotes in the database', async () => {
    await Quotes.update(1, 'lorem', 'ipsum', 'dolor');
    await expectInDatabase(rows => {
      expect(rows.length).toEqual(3);
      expect(rows[0]).toEqual({
        id: 1,
        content: 'lorem',
        author: 'ipsum',
        book: 'dolor',
        times_seen: 0,
      });
    });
  });

  it('can remove quotes from the database', async () => {
    await Quotes.remove(1);
    await expectInDatabase(rows => {
      expect(rows.length).toEqual(2);
    });
  });

  it('can append quotes into the database', async () => {
    await Quotes.importCsv(fakePapaparsedCsv, IMPORT_MODE_APPEND);
    await expectInDatabase(rows => {
      expect(rows.length).toEqual(5);
    });
  });

  it('can overwrite quotes in the database with new quotes', async () => {
    await Quotes.importCsv(fakePapaparsedCsv, IMPORT_MODE_OVERWRITE);
    await expectInDatabase(rows => {
      expect(rows.length).toEqual(3);
    });
  });

  it('can select all quotes from the database in a format suitable for export', async() => {
    const rows = await Quotes.exportCsv();
    expect(rows).toEqual([
      { content: 'Quote 1', author: 'Aauthor', book: 'Zbook', times_seen: 0 },
      { content: 'Quote 2', author: 'Bauthor', book: 'Ybook', times_seen: 0 },
      { content: 'Quote 3', author: 'Cauthor', book: 'Xbook', times_seen: 0 },
    ]);
  });

  it('can select quotes from the database evenly', async () => {
    for (let i = 0; i < 9; i++) {
      await Quotes.random();
    }
    await expectInDatabase(rows => {
      expect(rows).toEqual([
        { id: 1, content: 'Quote 1', author: 'Aauthor', book: 'Zbook', times_seen: 3 },
        { id: 2, content: 'Quote 2', author: 'Bauthor', book: 'Ybook', times_seen: 3 },
        { id: 3, content: 'Quote 3', author: 'Cauthor', book: 'Xbook', times_seen: 3 },
      ]);
    });
  });
});
