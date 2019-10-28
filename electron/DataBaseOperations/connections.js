var sqlite3 = require('sqlite3').verbose();

 
// db.serialize(function() {
//   db.run("CREATE TABLE lorem (info TEXT)");
 
//   var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//   for (var i = 0; i < 10; i++) {
//       stmt.run("Ipsum " + i);
//   }
//   stmt.finalize();
 
//   db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
//       console.log(row.id + ": " + row.info);
//   });
// });
 


module.exports.initDB= () =>
{
  let db = new sqlite3.Database('../db/breakers.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the Breakers SQlite database.');
    
  });
}

module.exports.closeDB= (db) =>
{
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}


module.exports.openConnectionReadWrite= (db) =>
{
  db = new sqlite3.Database('../db/breakers.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the chinook database.');
    return db;
  });
}

module.exports.selectStatementMultipleRowsTogether= (db,sql,params) =>
{
  db.all(sql, params, (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
  });
}

module.exports.selectStatementSignleRow= (db,sql,params) =>
{
  db.get(sql, params, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    return row
      ? console.log(row.id, row.name)
      : console.log(`No playlist found with the id ${playlistId}`);
   
  });
}

module.exports.selectStatementMultipleRowsSeperately= (db,sql,params) =>
{
  db.each(sql, params, (err, row) => {
    if (err) {
      throw err;
    }
    console.log(`${row.firstName} ${row.lastName} - ${row.email}`);
  });
   
}

module.exports.createTables = () =>
{
  let db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  // db.serialize(() => {
  //   // Queries scheduled here will be serialized.
  //   db.run(`CREATE TABLE Table1 
  //         (
  //           id INTEGER PRIMARY KEY,
  //           gameType TEXT,
  //           status TEXT,
  //           name TEXT,
  //           Date TEXT,
  //           startTime TEXT,
  //           endTime TEXT,
  //           amount Integer,
  //           paid TEXT
  //         )`
  //         )
  //     .run(`CREATE TABLE Table2 
  //         (
  //           id INTEGER PRIMARY KEY,
  //           gameType TEXT,
  //           status TEXT,
  //           name TEXT,
  //           Date TEXT,
  //           startTime TEXT,
  //           endTime TEXT,
  //           amount Integer,
  //           paid TEXT
  //         )`
  //         )
  //     .run(`CREATE TABLE Table3 
  //         (
  //           id INTEGER PRIMARY KEY,
  //           gameType TEXT,
  //           status TEXT,
  //           name TEXT,
  //           Date TEXT,
  //           startTime TEXT,
  //           endTime TEXT,
  //           amount Integer,
  //           paid TEXT
  //         )`
  //         )
  //     .run(`CREATE TABLE Table4 
  //         (
  //           id INTEGER PRIMARY KEY,
  //           gameType TEXT,
  //           status TEXT,
  //           name TEXT,
  //           Date TEXT,
  //           startTime TEXT,
  //           endTime TEXT,
  //           amount Integer,
  //           paid TEXT
  //         )`
  //         )
  //     .run(`CREATE TABLE Table5 
  //         (
  //           id INTEGER PRIMARY KEY,
  //           gameType TEXT,
  //           status TEXT,
  //           name TEXT,
  //           Date TEXT,
  //           startTime TEXT,
  //           endTime TEXT,
  //           amount Integer,
  //           paid TEXT
  //         )`
  //         )
  //     .run(`CREATE TABLE Table6 
  //         (
  //           id INTEGER PRIMARY KEY,
  //           gameType TEXT,
  //           status TEXT,
  //           name TEXT,
  //           Date TEXT,
  //           startTime TEXT,
  //           endTime TEXT,
  //           amount Integer,
  //           paid TEXT
  //         )`
  //         )
  //     .run(`CREATE TABLE Table7 
  //         (
  //           id INTEGER PRIMARY KEY,
  //           gameType TEXT,
  //           status TEXT,
  //           name TEXT,
  //           Date TEXT,
  //           startTime TEXT,
  //           endTime TEXT,
  //           amount Integer,
  //           paid TEXT
  //         )`
  //         )
  //     .run(`CREATE TABLE Table8 
  //         (
  //           id INTEGER PRIMARY KEY,
  //           gameType TEXT,
  //           status TEXT,
  //           name TEXT,
  //           Date TEXT,
  //           startTime TEXT,
  //           endTime TEXT,
  //           amount Integer,
  //           paid TEXT
  //         )`
  //         )
  //     .run(`CREATE TABLE Table9 
  //         (
  //           id INTEGER PRIMARY KEY,
  //           gameType TEXT,
  //           status TEXT,
  //           name TEXT,
  //           Date TEXT,
  //           startTime TEXT,
  //           endTime TEXT,
  //           amount Integer,
  //           paid TEXT
  //         )`
  //         )
  //     .run(`CREATE TABLE Table10 s
  //         (
  //           id INTEGER PRIMARY KEY,
  //           gameType TEXT,
  //           status TEXT,
  //           name TEXT,
  //           Date TEXT,
  //           startTime TEXT,
  //           endTime TEXT,
  //           amount Integer,
  //           paid TEXT
  //         )`
  //         )
  //     .run(`CREATE TABLE Kitchen 
  //         (
  //           id INTEGER PRIMARY KEY,
  //           name TEXT,
  //           itemName TEXT,
  //           date TEXT,
  //           time TEXT,
  //           amount Integer,
  //           paid TEXT,
  //           tableNo INTEGER
  //         )`
  //         )
  //     .run(`CREATE TABLE Drinks 
  //         (
  //           id INTEGER PRIMARY KEY,
  //           name TEXT,
  //           drink TEXT,
  //           quantity TEXT,
  //           date TEXT,
  //           time TEXT,
  //           amount Integer,
  //           paid TEXT,
  //           tableNo INTEGER
  //         )`
  //         )
  //     .run(`CREATE TABLE Expense 
  //         (
  //           id INTEGER PRIMARY KEY,
  //           name TEXT,
  //           type TEXT,
  //           date TEXT,
  //           time TEXT,
  //           amount Integer,
  //           paid TEXT,
  //           tableNo INTEGER
  //         )`
  //         )
  //     .run(`CREATE TABLE Credit 
  //         (
  //           id INTEGER PRIMARY KEY,
  //           name TEXT,
  //           amount Integer
  //         )`
  //         )
  // });
  let info=db.exec('PRAGMA db.table_info(Credit);', function(error)  {
    if (error){
        console.error("Pragma statement didn't work.")
    } 
    console.log(info)
});

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}