var sqlite3 = require('sqlite3').verbose();
var util=require('util')
 
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


//open Database
module.exports.openDB= () =>
{
  let db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
    return db;
  });
}

//Close Databse
module.exports.closeDB= () =>
{
  let db = new sqlite3.Database('./db/breakers.db');
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}

//Create Tables
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
    db.run('CREATE TABLE IF NOT EXISTS Customer(customerId INTEGER PRIMARY KEY AUTOINCREMENT,customerName text NOT NULL, customerPhone text, customerAddress text, createDate text NOT NULL,updateDate text,member INTEGER DEFAULT 0)')
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

//Select Multiple Rows Together with Promise Return
function selectStatementMultipleRowsTogether (db,sql)
{
  return new Promise(function(resolve, reject) {
    db.all(sql, (err, rows) => {
        if (err !== null) reject(err);
        else resolve(rows);
    });
  });
}


//Get Customers
module.exports.getCustomers =  async() =>
{
  let db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  sql='Select * from Customer';
  
  
  let rows=await selectStatementMultipleRowsTogether(db,sql).then(rows=>
      {
        return rows;
      })
  
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
  return new Promise(function(resolve, reject) {
    resolve(rows);
   });
}

//Get All Cigarettes in Stock
module.exports.getCigarettes =  async() =>
{
  let db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  sql='Select * from Inventory WHERE inventoryCategoryId=1 AND quantity>0';
  
  
  let rows=await selectStatementMultipleRowsTogether(db,sql).then(rows=>
      {
        return rows;
      })
  
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
  return new Promise(function(resolve, reject) {
    resolve(rows);
   });
}

//Get All Drinks in Stock
module.exports.getDrinks =  async() =>
{
  let db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  sql='Select * from Inventory WHERE inventoryCategoryId=2 AND quantity>0';
  
  
  let rows=await selectStatementMultipleRowsTogether(db,sql).then(rows=>
      {
        return rows;
      })
  
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
  return new Promise(function(resolve, reject) {
    resolve(rows);
   });
}


//Start Game
module.exports.startGame=(tableNumber, status, gameType, id1, id2,id3,id4,id5,id6,id7,id8,id9,id10, startTime,createDate)=>
{
  let db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });

  return new Promise(function(resolve, reject) {
    db.run('Insert into game ( tableNo, status ,  gameType , customerId1  , customerId2  , customerId3  , customerId4 , customerId5  , customerId6  , customerId7  , customerId8 , customerId9  , customerId10 , startTime , createDate ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [tableNumber, status, gameType, id1, id2, id3,id4,id5,id6,id7,id8,id9,id10, startTime,createDate], (err) => {
        if (err !== null) 
        reject(err);
        else 
        {
          db.close((err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Close the database connection.');
          });
          resolve(true);
        }
    });
  });
}


//Check Ongoing Games on All Tables
module.exports.getOngoingGames =  async() =>
{
  let db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  sql1='SELECT * FROM Game WHERE tableNo=1 AND status=\'ongoing\'';
  sql2='SELECT * FROM Game WHERE tableNo=2 AND status=\'ongoing\'';
  sql3='SELECT * FROM Game WHERE tableNo=3 AND status=\'ongoing\'';
  sql4='SELECT * FROM Game WHERE tableNo=4 AND status=\'ongoing\'';
  sql5='SELECT * FROM Game WHERE tableNo=5 AND status=\'ongoing\'';
  sql6='SELECT * FROM Game WHERE tableNo=6 AND status=\'ongoing\'';
  sql7='SELECT * FROM Game WHERE tableNo=7 AND status=\'ongoing\'';
  sql8='SELECT * FROM Game WHERE tableNo=8 AND status=\'ongoing\'';
  let tab1=await selectStatementMultipleRowsTogether(db,sql1).then(rows=>
      {
        return rows;
      })
  let tab2=await selectStatementMultipleRowsTogether(db,sql2).then(rows=>
      {
        return rows;
      })
  let tab3=await selectStatementMultipleRowsTogether(db,sql3).then(rows=>
      {
        return rows;
      })
  let tab4=await selectStatementMultipleRowsTogether(db,sql4).then(rows=>
      {
        return rows;
      })
  let tab5=await selectStatementMultipleRowsTogether(db,sql5).then(rows=>
      {
        return rows;
      })
  let tab6=await selectStatementMultipleRowsTogether(db,sql6).then(rows=>
      {
        return rows;
      })
  let tab7=await selectStatementMultipleRowsTogether(db,sql7).then(rows=>
      {
        return rows;
      })
  let tab8=await selectStatementMultipleRowsTogether(db,sql8).then(rows=>
      {
        return rows;
      })
      
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
  return Promise.all([tab1, tab2, tab3,tab4, tab5, tab6,tab7, tab8]);
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


//Add Order
module.exports.addOrder = (createDate,updateDate,inventoryId,gameId,customerId,quantity,amount) =>
{
  let db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  db.serialize(() => {
    // Queries scheduled here will be serialized.
    db.run('Insert into InventoryManagement(createDate,quantity,inventoryId,gameId) values(?,?,?,?)',[createDate,-quantity,inventoryId,gameId])
    .run('UPDATE Inventory SET updateDate=?,quantity=(Select quantity from Inventory where inventoryId=?)-? where inventoryId=?',[updateDate,inventoryId,quantity,inventoryId])
    .run('Insert into Revenue(createDate,revenueName,revenueAmount,revenueDescription,revenueCategoryId,inventoryManagementId,gameId) values (?,((Select inventoryCategoryName from InventoryCategory where inventoryCategoryId=(Select inventoryCategoryId from Inventory where inventoryId=?))||" Sold"),?,(Select itemName from Inventory where inventoryId=?),(Select revenueCategoryId from RevenueCategory where revenueCategoryName=(Select inventoryCategoryName from InventoryCategory where inventoryCategoryId=(Select inventoryCategoryId from Inventory where inventoryId=?))), (SELECT MAX(inventoryManagementId) FROM InventoryManagement),?)',[createDate,inventoryId,amount,inventoryId,inventoryId,gameId])
    .run('Insert into Bill(createDate,status,customerId,amount,revenueId) values(?,"unpaid",?,?,(SELECT MAX(revenueId) FROM Revenue))',[createDate,customerId,amount])
    });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}
 
 
//Add Customer
module.exports.addCustomer=(customerName,customerAddress,customerPhone,createDate)=>
{
  let db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });

  return new Promise(function(resolve, reject) {
    db.run('Insert into customer ( customerName,customerAddress,customerPhone, createDate ) values (?,?,?,?)', [customerName,customerAddress,customerPhone,createDate], (err) => {
        if (err !== null) 
        reject(err);
        else 
        {
          db.close((err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Close the database connection.');
          });
          resolve(true);
        }
    });
  });
}

//Delete Customer
module.exports.deleteCustomer=(customerId)=>
{
  let db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });

  console.log("delete")
  return new Promise(function(resolve, reject) {
    db.run('Delete from customer where customerId=?', [customerId], (err) => {
        if (err !== null){
          reject(err);
          console.log("error in 222")
        } 
        
        else 
        {
          db.close((err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Close the database connection.');
          });
          resolve(true);
        }
    });
  });
}