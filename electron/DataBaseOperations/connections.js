var sqlite3 = require('sqlite3').verbose();
var util=require('util')



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
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
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
  var db = new sqlite3.Database('./db/breakers.db');
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
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  db.serialize(() => {
    // Queries scheduled here will be serialized.
    db.run('CREATE TABLE IF NOT EXISTS Customer(customerId INTEGER PRIMARY KEY AUTOINCREMENT,customerName text NOT NULL, customerPhone text, customerAddress text, createDate text NOT NULL,updateDate text,member INTEGER DEFAULT 0,creditAmount INTEGER DEFAULT 0)')
      .run('CREATE TABLE IF NOT EXISTS Game(gameId INTEGER PRIMARY KEY AUTOINCREMENT,gameType text NOT NULL, tableNo int NOT NULL, startTime text NOT NULL, endTime text,status text NOT NULL,customerId1 int ,customerId2 int,customerId3 int ,customerId4 int,customerId5 int ,customerId6 int,customerId7 int ,customerId8 int, customerId9 int ,customerId10 int, loserId1 int,loserId2 int, amount int, createDate text NOT NULL,updateDate text,FOREIGN KEY(customerId1) REFERENCES Customer(customerId),FOREIGN KEY(customerId2) REFERENCES Customer(customerId),FOREIGN KEY(customerId3) REFERENCES Customer(customerId),FOREIGN KEY(customerId4) REFERENCES Customer(customerId),FOREIGN KEY(customerId5) REFERENCES Customer(customerId),FOREIGN KEY(customerId6) REFERENCES Customer(customerId),FOREIGN KEY(customerId7) REFERENCES Customer(customerId),FOREIGN KEY(customerId8) REFERENCES Customer(customerId),FOREIGN KEY(customerId9) REFERENCES Customer(customerId),FOREIGN KEY(customerId10) REFERENCES Customer(customerId),FOREIGN KEY(loserId1) REFERENCES Customer(customerId),FOREIGN KEY(loserId2) REFERENCES Customer(customerId))')
      .run('CREATE TABLE IF NOT EXISTS CreditManagement(creditManagementId INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL,clearingTime text, createDate text,updateDate text,customerId INTEGER,FOREIGN KEY(customerId) REFERENCES Customer(customerId))')
      .run('Create table IF NOT EXISTS InventoryCategory(inventoryCategoryId INTEGER PRIMARY KEY AUTOINCREMENT,inventoryCategoryName text UNIQUE, createDate text, updateDate text)')
      .run('CREATE TABLE IF NOT EXISTS Inventory(inventoryId INTEGER PRIMARY KEY AUTOINCREMENT,itemName text UNIQUE, itemAmount int,quantity REAL,itemDescription text, createDate text,updateDate text,inventoryCategoryId int,FOREIGN KEY(inventoryCategoryId) REFERENCES InventoryCategory(inventoryCategoryId))')
      .run('CREATE TABLE IF NOT EXISTS InventoryManagement(inventoryManagementId INTEGER PRIMARY KEY AUTOINCREMENT, createDate text,updateDate text,quantity REAL,inventoryId int,gameId int, FOREIGN KEY(gameId) REFERENCES Game(gameId) ,FOREIGN KEY(inventoryId) REFERENCES Inventory(inventoryId))')
      .run('CREATE TABLE IF NOT EXISTS ExpenseCategory(expenseCategoryId INTEGER PRIMARY KEY AUTOINCREMENT,expenseCategoryName text UNIQUE,createDate text,updateDate text)')
      .run('CREATE TABLE IF NOT EXISTS RevenueCategory(revenueCategoryId INTEGER PRIMARY KEY AUTOINCREMENT,revenueCategoryName text UNIQUE,createDate text,updateDate text)')
      .run('CREATE TABLE IF NOT EXISTS Expense(expenseId INTEGER PRIMARY KEY AUTOINCREMENT,expenseName text, expenseAmount int, expenseDescription text , createDate text,updateDate text, expenseCategoryId int,inventoryManagementId int, gameId int, FOREIGN KEY(gameId) REFERENCES Game(gameId) , FOREIGN KEY(inventoryManagementId) REFERENCES InventoryManagement(inventoryManagementId) , FOREIGN KEY(expenseCategoryId) REFERENCES ExpenseCategory(expenseCategoryId))')
      .run('CREATE TABLE IF NOT EXISTS Revenue(revenueId INTEGER PRIMARY KEY AUTOINCREMENT,revenueName text, revenueAmount int, revenueDescription text , createDate text,updateDate text, revenueCategoryId int,inventoryManagementId int, gameId int, FOREIGN KEY(gameId) REFERENCES Game(gameId) , FOREIGN KEY(inventoryManagementId) REFERENCES InventoryManagement(inventoryManagementId) , FOREIGN KEY(revenueCategoryId) REFERENCES RevenueCategory(revenueCategoryId))')
      .run('CREATE TABLE IF NOT EXISTS Account(accountId INTEGER PRIMARY KEY AUTOINCREMENT,accountName text,accountDescription text, amount int,createDate text,updateDate text)')
      .run('CREATE Table IF NOT EXISTS Closing(closingId INTEGER PRIMARY KEY AUTOINCREMENT, closingAmount int,createDate text,updateDate text,closingAccountId int,FOREIGN KEY(closingAccountId) REFERENCES Account(accountId))')
      .run('CREATE TABLE IF NOT EXISTS Employee(employeeId INTEGER PRIMARY KEY AUTOINCREMENT,employeeName text, employeePhone text, employeeAddress text, employeeCNIC text,employeeDesignation text, employeeSalary int, employeeAdvance int DEFAULT 0, createDate text,updateDate text)')
      .run('CREATE TABLE IF NOT EXISTS Salary(salaryId INTEGER PRIMARY KEY AUTOINCREMENT,salaryMonth text, salaryAmount int, createDate text,updateDate text,employeeId int,FOREIGN KEY(employeeId) REFERENCES Employee(employeeId))')
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
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  sql='Select * from Customer';
  
  
  var rows=await selectStatementMultipleRowsTogether(db,sql).then(rows=>
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



//Get Creditors
module.exports.getCreditors =  async() =>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  sql='Select customerName,creditAmount,customerId from Customer WHERE creditAmount>0';
  
  
  var rows=await selectStatementMultipleRowsTogether(db,sql).then(rows=>
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



//Get Cred Clear History
module.exports.getCreditHistory =  async(customerId) =>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  sql='SELECT Customer.customerName,CreditManagement.createDate,CreditManagement.clearingTime,CreditManagement.amount FROM Customer JOIN CreditManagement using (customerId) WHERE customerId='+customerId;
  
  
  var rows=await selectStatementMultipleRowsTogether(db,sql).then(rows=>
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


//Clear Credit
module.exports.clearCredit =  (currentDate,customerId,clearedAmount) =>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  const today = new Date();
  const clearingTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  db.run('UPDATE Customer SET updateDate=?,creditAmount=((SELECT creditAmount FROM Customer WHERE customerId=?)-?) WHERE customerId=?',[currentDate,customerId,clearedAmount,customerId])
  db.run('Insert into CreditManagement(createDate,amount,clearingTime,customerId) values(?,?,?,?)',[currentDate,-clearedAmount,clearingTime,customerId])
  
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
  
}

//Get All Employees
module.exports.getEmployees =  async() =>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  sql='Select * from Employee';
  
  
  var rows=await selectStatementMultipleRowsTogether(db,sql).then(rows=>
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
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  sql='Select * from Inventory WHERE inventoryCategoryId=1 AND quantity>0';
  
  
  var rows=await selectStatementMultipleRowsTogether(db,sql).then(rows=>
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
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  sql='Select * from Inventory WHERE inventoryCategoryId=2 AND quantity>0';
  
  
  var rows=await selectStatementMultipleRowsTogether(db,sql).then(rows=>
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
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
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
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
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
  var tab1=await selectStatementMultipleRowsTogether(db,sql1).then(rows=>
      {
        return rows;
      })
  var tab2=await selectStatementMultipleRowsTogether(db,sql2).then(rows=>
      {
        return rows;
      })
  var tab3=await selectStatementMultipleRowsTogether(db,sql3).then(rows=>
      {
        return rows;
      })
  var tab4=await selectStatementMultipleRowsTogether(db,sql4).then(rows=>
      {
        return rows;
      })
  var tab5=await selectStatementMultipleRowsTogether(db,sql5).then(rows=>
      {
        return rows;
      })
  var tab6=await selectStatementMultipleRowsTogether(db,sql6).then(rows=>
      {
        return rows;
      })
  var tab7=await selectStatementMultipleRowsTogether(db,sql7).then(rows=>
      {
        return rows;
      })
  var tab8=await selectStatementMultipleRowsTogether(db,sql8).then(rows=>
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


//Generate Bill
module.exports.generateBill =  async(customerId) =>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  sql1='SELECT Bill.billId,Bill.amount,Game.gameType,Revenue.revenueDescription,Game.startTime,Game.tableNo from Bill JOIN Revenue USING (revenueId) JOIN Game USING (gameId) WHERE Revenue.revenueName ="Games Sale" AND Bill.status="unpaid" and Bill.customerId='+customerId;
  sql2='SELECT Bill.billId,Game.tableNo,Bill.amount,Inventory.itemName,InventoryManagement.quantity,Revenue.gameId from Bill JOIN Revenue USING (revenueId)  JOIN InventoryManagement USING (inventoryManagementId) JOIN Inventory USING (inventoryId) LEFT JOIN Game on Game.gameId=Revenue.gameId WHERE Bill.customerId='+customerId+' and Bill.status="unpaid" UNION ALL SELECT Bill.billId,Game.tableNo,Bill.amount,Inventory.itemName,InventoryManagement.quantity,Revenue.gameId from Game  LEFT JOIN (Revenue JOIN Bill USING (revenueId) JOIN InventoryManagement USING (inventoryManagementId) JOIN Inventory USING (inventoryId)) using (gameId) WHERE Game.gameId IS NULL and Bill.status="unpaid" and Bill.customerId='+customerId;
  sql3='Select Bill.billId,Bill.amount,Revenue.revenueDescription,Game.tableNo FROM Bill JOIN Revenue using(revenueId) LEFT JOIN Game using(gameId) WHERE Bill.customerId='+customerId+' and(revenueName="Misc Sale" or revenueName="Kitchen Sale") and Bill.status="unpaid" UNION ALL Select Bill.billId,Bill.amount,Revenue.revenueDescription,Game.tableNo FROM Game LEFT JOIN Revenue using(gameId) JOIN Bill using(revenueId) WHERE Bill.customerId='+customerId+' and(revenueName="Misc Sale" or revenueName="Kitchen Sale") and(Revenue.gameId IS NULL) and Bill.status="unpaid"'

  var tab1=await selectStatementMultipleRowsTogether(db,sql1).then(rows=>
      {
        return rows;
      })
  var tab2=await selectStatementMultipleRowsTogether(db,sql2).then(rows=>
      {
        return rows;
      })
  var tab3=await selectStatementMultipleRowsTogether(db,sql3).then(rows=>
      {
        return rows;
      })    
  
      
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
  return Promise.all([tab1, tab2,tab3]);
}


//Pay Bill
module.exports.payBill=(currentDate,status,creditAmount,customerId,...billIdArray)=>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });


  //Set Status in Bill
  for(let i=0;i<billIdArray.length;i++)
    {
      db.run('UPDATE Bill SET status=?,updateDate=? WHERE billId=?',[status,currentDate,billIdArray[i]])
    }

  //If Partial paid add into creditAmount and CreditManagement
  if(status==="Partial Paid")
  {
    const today = new Date();
    const clearingTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    db.run('UPDATE Customer SET updateDate=?,creditAmount=((SELECT creditAmount FROM Customer WHERE customerId=?)+?) WHERE customerId=?',[currentDate,customerId,creditAmount,customerId])
    db.run('Insert into CreditManagement(createDate,amount,clearingTime,customerId) values(?,?,?,?)',[currentDate,creditAmount,clearingTime,customerId])
  }
  

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
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
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


//End Game
module.exports.endGame = (createDate,updateDate,gameId,amount,loserId1,loserId2,endTime) =>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });

  if(loserId2===null)
  {
    return new Promise(function(resolve, reject) {
      db.serialize(() => {
        // Queries scheduled here will be serialized.
        db.run('UPDATE Game SET updateDate=?,status="completed",loserId1=?,loserId2=?,endTime=?,amount=? WHERE gameId=?',[updateDate,loserId1,loserId2,endTime,amount,gameId])
        .run('Insert into Revenue(createDate,revenueName,revenueAmount,revenueDescription,revenueCategoryId,gameId) values (?,"Games Sale",?,((SELECT gameType from Game WHERE gameId=?)||" Game"),(Select revenueCategoryId from RevenueCategory where revenueCategoryName="Games"),?)',[createDate,amount,gameId,gameId])
        .run('Insert into Bill(createDate,status,customerId,amount,revenueId) values(?,"unpaid",?,?,(SELECT MAX(revenueId) FROM Revenue))',[createDate,loserId1,amount], (err) => {
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
     })
    });
  }
  else
  {
  return new Promise(function(resolve, reject) {
    db.serialize(() => {
      // Queries scheduled here will be serialized.
      db.run('UPDATE Game SET updateDate=?,status="completed",loserId1=?,loserId2=?,endTime=?,amount=? WHERE gameId=?',[updateDate,loserId1,loserId2,endTime,amount,gameId])
      .run('Insert into Revenue(createDate,revenueName,revenueAmount,revenueDescription,revenueCategoryId,gameId) values (?,"Games Sale",?,((SELECT gameType from Game WHERE gameId=?)||" Game"),(Select revenueCategoryId from RevenueCategory where revenueCategoryName="Games"),?)',[createDate,amount,gameId,gameId])
      .run('Insert into Bill(createDate,status,customerId,amount,revenueId) values(?,"unpaid",?,?,(SELECT MAX(revenueId) FROM Revenue))',[createDate,loserId1,amount/2])
      .run('Insert into Bill(createDate,status,customerId,amount,revenueId) values(?,"unpaid",?,?,(SELECT MAX(revenueId) FROM Revenue))',[createDate,loserId2,amount/2], (err) => {
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
   })
  });
}
}

//Add Order For inventory Items
module.exports.addOrder = (createDate,updateDate,inventoryId,gameId,customerId,quantity,amount) =>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  db.serialize(() => {
    // Queries scheduled here will be serialized.
    db.run('Insert into InventoryManagement(createDate,quantity,inventoryId,gameId) values(?,?,?,?)',[createDate,-quantity,inventoryId,gameId])
    .run('UPDATE Inventory SET updateDate=?,quantity=(Select quantity from Inventory where inventoryId=?)-? where inventoryId=?',[updateDate,inventoryId,quantity,inventoryId])
    .run('Insert into Revenue(createDate,revenueName,revenueAmount,revenueDescription,revenueCategoryId,inventoryManagementId,gameId) values (?,((Select inventoryCategoryName from InventoryCategory where inventoryCategoryId=(Select inventoryCategoryId from Inventory where inventoryId=?))||" Sale"),?,(Select itemName from Inventory where inventoryId=?),(Select revenueCategoryId from RevenueCategory where revenueCategoryName=(Select inventoryCategoryName from InventoryCategory where inventoryCategoryId=(Select inventoryCategoryId from Inventory where inventoryId=?))), (SELECT MAX(inventoryManagementId) FROM InventoryManagement),?)',[createDate,inventoryId,amount*quantity,inventoryId,inventoryId,gameId])
    .run('Insert into Bill(createDate,status,customerId,amount,revenueId) values(?,"unpaid",?,?,(SELECT MAX(revenueId) FROM Revenue))',[createDate,customerId,amount*quantity])
    });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}


//Add Order for others
module.exports.addOrderOthers = (createDate,gameId,customerId,categoryName,itemName,amount) =>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  db.serialize(() => {
    // Queries scheduled here will be serialized.
    db.run('Insert into Revenue(createDate,revenueName,revenueAmount,revenueDescription,revenueCategoryId,gameId) values (?,(?||" Sale"),?,?,(Select revenueCategoryId from RevenueCategory where revenueCategoryName=?),?)',[createDate,categoryName,amount,itemName,categoryName,gameId])
    .run('Insert into Bill(createDate,status,customerId,amount,revenueId) values(?,"unpaid",?,?,(SELECT MAX(revenueId) FROM Revenue))',[createDate,customerId,amount])
    });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}
 
//Add Employee
module.exports.addEmployee=(employeeName, employeeDesignation, employeeCNIC, employeeAddress, employeePhone, employeeBasicPay, createDate)=>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  return new Promise(function(resolve, reject) {
    db.run('Insert into Employee ( employeeName, employeeDesignation, employeeCNIC, employeeAddress, employeePhone, employeeSalary, createDate ) values (?,?,?,?,?,?,?)', [employeeName, employeeDesignation, employeeCNIC, employeeAddress, employeePhone, employeeBasicPay, createDate], (err) => {
        if (err !== null){
          console.error(err.message);
          // reject(err);
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
 
//Add Advance of Employee
module.exports.addAdvanceEmployee=(employeeId, advanceAmount)=>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  return new Promise(function(resolve, reject) {
    db.run('UPDATE Employee SET employeeAdvance =((Select employeeAdvance FROM Employee where employeeId=?)+?) WHERE employeeId =?', [employeeId,advanceAmount, employeeId], (err) => {
        if (err !== null){
          console.error(err.message);
          // reject(err);
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

//Add Salary of Employee
module.exports.paySalaryEmployee = (employeeId,salaryMonth, salaryAmount,salaryNote, advanceDeductionAmount,createDate) =>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });

    return new Promise(function(resolve, reject) {
      db.serialize(() => {
        // Queries scheduled here will be serialized.
        db.run('Insert into Salary (salaryAmount,salaryMonth, createDate, employeeId) values(?,?,?,?)',[salaryAmount,salaryMonth,createDate,employeeId])
        .run('Insert into Expense (createDate,expenseName,expenseCategoryId,expenseDescription,expenseAmount) values (?,((SELECT employeeName FROM Employee WHERE employeeId=?)||" Salary Paid"),(Select expenseCategoryId from ExpenseCategory WHERE expenseCategoryName="Salary"),?,?)',[createDate,employeeId,salaryNote,salaryAmount])
        .run('UPDATE Employee SET employeeAdvance = ((Select employeeAdvance from Employee where employeeId=?)-?) WHERE employeeId =?', [employeeId,advanceDeductionAmount, employeeId], (err) => {
          if (err !== null) 
          console.log(err)
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
     })
    });
  }
 







//Add Customer
module.exports.addCustomer=(customerName,customerAddress,customerPhone,createDate)=>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
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


//Add Expense
module.exports.addExpense=(expenseName,expenseDescription,expenseAmount,createDate,expenseCategoryId)=>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });

  return new Promise(function(resolve, reject) {
    db.run('Insert into Expense (createDate,expenseName,expenseCategoryId,expenseDescription,expenseAmount) values (?,?,(Select expenseCategoryId from ExpenseCategory WHERE expenseCategoryId=?),?,?)',[createDate,expenseName,expenseCategoryId,expenseDescription,expenseAmount], (err) => {
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



//Get Expense Category
module.exports.getExpense =  async() =>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  sql='Select Expense.expenseId, Expense.expenseName, Expense.expenseDescription, Expense.expenseAmount, Expense.createDate, ExpenseCategory.expenseCategoryName as expenseCategory  from Expense JOIN  ExpenseCategory USING(expenseCategoryId)';
  
  
  var rows=await selectStatementMultipleRowsTogether(db,sql).then(rows=>
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


//Get Expense
module.exports.getExpenseCategory =  async() =>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  sql='SELECT ExpenseCategory.expenseCategoryId, ExpenseCategory.expenseCategoryName FROM ExpenseCategory';
  
  
  var rows=await selectStatementMultipleRowsTogether(db,sql).then(rows=>
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



//Get Revenue
module.exports.getRevenue =  async() =>
{
  var db = new sqlite3.Database('./db/breakers.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the breakers database.');
  });
  
  sql='Select Revenue.revenueId, Revenue.revenueName, Revenue.revenueDescription, Revenue.revenueAmount, Revenue.createDate, RevenueCategory.revenueCategoryName as revenueCategory  from Revenue JOIN  RevenueCategory USING(revenueCategoryId)';
  
  
  var rows=await selectStatementMultipleRowsTogether(db,sql).then(rows=>
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