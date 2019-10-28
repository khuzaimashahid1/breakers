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
  
  db.serialize(() => {
    // Queries scheduled here will be serialized.
    db.run('CREATE TABLE IF NOT EXISTS Customer(customerId INTEGER PRIMARY KEY AUTOINCREMENT,customerName text NOT NULL, customerPhone text, customerAddress text, createDate text NOT NULL,updateDate text)')
      .run('CREATE TABLE IF NOT EXISTS Game(gameId INTEGER PRIMARY KEY AUTOINCREMENT,gameType text NOT NULL, tableNo int NOT NULL, startTime text NOT NULL, endTime text,status text NOT NULL,customerId1 int ,customerId2 int,customerId3 int ,customerId4 int,customerId5 int ,customerId6 int,customerId7 int ,customerId8 int, customerId9 int ,customerId10 int, loserId1 int,loserId2 int, amount int, createDate text NOT NULL,updateDate text,FOREIGN KEY(customerId1) REFERENCES Customer(customerId),FOREIGN KEY(customerId2) REFERENCES Customer(customerId),FOREIGN KEY(customerId3) REFERENCES Customer(customerId),FOREIGN KEY(customerId4) REFERENCES Customer(customerId),FOREIGN KEY(customerId5) REFERENCES Customer(customerId),FOREIGN KEY(customerId6) REFERENCES Customer(customerId),FOREIGN KEY(customerId7) REFERENCES Customer(customerId),FOREIGN KEY(customerId8) REFERENCES Customer(customerId),FOREIGN KEY(customerId9) REFERENCES Customer(customerId),FOREIGN KEY(customerId10) REFERENCES Customer(customerId),FOREIGN KEY(loserId1) REFERENCES Customer(customerId),FOREIGN KEY(loserId2) REFERENCES Customer(customerId))')
      .run('Create table IF NOT EXISTS InventoryCategory(inventoryCategoryId INTEGER PRIMARY KEY AUTOINCREMENT,inventoryCategoryName text UNIQUE, createDate text, updateDate text)')
      .run('CREATE TABLE IF NOT EXISTS Inventory(inventoryId INTEGER PRIMARY KEY AUTOINCREMENT,itemName text UNIQUE, itemAmount int,quantity REAL,itemDescription text, createDate text,updateDate text,inventoryCategoryId int,FOREIGN KEY(inventoryCategoryId) REFERENCES InventoryCategory(inventoryCategoryId))')
      .run('CREATE TABLE IF NOT EXISTS InventoryManagement(inventoryManagementId INTEGER PRIMARY KEY AUTOINCREMENT, createDate text,updateDate text,quantity REAL,inventoryId int,gameId int, FOREIGN KEY(gameId) REFERENCES Game(gameId) ,FOREIGN KEY(inventoryId) REFERENCES Inventory(inventoryId))')
      .run('CREATE TABLE IF NOT EXISTS ExpenseCategory(expenseCategoryId INTEGER PRIMARY KEY AUTOINCREMENT,expenseCategoryName text UNIQUE,createDate text,updateDate text)')
      .run('CREATE TABLE IF NOT EXISTS RevenueCategory(revenueCategoryId INTEGER PRIMARY KEY AUTOINCREMENT,revenueCategoryName text UNIQUE,createDate text,updateDate text)')
      .run('CREATE TABLE IF NOT EXISTS Expense(expenseId INTEGER PRIMARY KEY AUTOINCREMENT,expenseName text, expenseAmount int, expenseDescription text , createDate text,updateDate text, expenseCategoryId int,inventoryManagementId int, gameId int, FOREIGN KEY(gameId) REFERENCES Game(gameId) , FOREIGN KEY(inventoryManagementId) REFERENCES InventoryManagement(inventoryManagementId) , FOREIGN KEY(expenseCategoryId) REFERENCES ExpenseCategory(expenseCategoryId))')
      .run('CREATE TABLE IF NOT EXISTS Revenue(revenueId INTEGER PRIMARY KEY AUTOINCREMENT,revenueName text, revenueAmount int, revenueDescription text , createDate text,updateDate text, revenueCategoryId int,inventoryManagementId int, gameId int, FOREIGN KEY(gameId) REFERENCES Game(gameId) , FOREIGN KEY(inventoryManagementId) REFERENCES InventoryManagement(inventoryManagementId) , FOREIGN KEY(revenueCategoryId) REFERENCES RevenueCategory(revenueCategoryId))')
      .run('CREATE TABLE IF NOT EXISTS Account(accountId INTEGER PRIMARY KEY AUTOINCREMENT,accountName text,accountDescription text, amount int,createDate text,updateDate text)')
      .run('CREATE Table IF NOT EXISTS Closing(closingId INTEGER PRIMARY KEY AUTOINCREMENT, closingAmount int,createDate text,updateDate text,closingAccountId int,FOREIGN KEY(closingAccountId) REFERENCES Account(accountId))')
      .run('CREATE TABLE IF NOT EXISTS Employee(employeeId INTEGER PRIMARY KEY AUTOINCREMENT,employeeName text, employeePhone text, employeeAddress text, employeeeCNIC text,employeeDesignation text, employeeSalary int, createDate text,updateDate text)')
      .run('CREATE TABLE IF NOT EXISTS Salary(salaryId INTEGER PRIMARY KEY AUTOINCREMENT,salaryMonth text, salaryAmount int,salaryNote text, salaryDue int, createDate text,updateDate text,employeeId int,FOREIGN KEY(employeeId) REFERENCES Employee(employeeId))')
      .run('CREATE TABLE IF NOT EXISTS Bill(billId INTEGER PRIMARY KEY AUTOINCREMENT,amount int,createDate text,updateDate text,status text,customerId int,revenueId int,FOREIGN KEY(customerId) REFERENCES Customer(customerId),FOREIGN KEY(revenueId) REFERENCES Revenue(revenueId))')
    });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}

//Unique Constraint Failed (errno:19)
module.exports.runDuplicateInsertQuery = () =>
{
  let db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  db.run('Insert into Inventory (itemName,itemAmount,quantity,createDate,inventoryCategoryId) values ("Redbull",250,10,"07-10-2019",2)',
  (err)=>
  {
    if(err.errno==19)
    console.log("Record with this name Already Exists")
  });
  

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}