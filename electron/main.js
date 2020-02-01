const { app, BrowserWindow } = require("electron");
const electron = require("electron")
const { remote } = require('electron');
const path = require("path");
const url = require("url");
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const connections = require("./DataBaseOperations/connections.js");


connections.createTables();
global.win = null;
global.sharedObj = {
    tableNumber: null,
    status: [],
    games: [],
    allplayers: null,
    players: null,
    currentPlayers: []
}

function createWindow() {
    win = new BrowserWindow({
        fullscreen: false,
        webPreferences: {
            nativeWindowOpen: true,
            nodeIntegration: true,
        }
    });
    win.maximize();
    win.loadURL(url.format({
        pathname: path.join(__dirname, "./views/Index.html"),
        protocol: "file",
        slashes: "true"
    }))

    win.on("closed", () => {
        win = null;

    })
}

//Error Dialouge Box Pop-up
ipc.on('error-dialog', function (event, message) {
    dialog.showErrorBox("ERROR", message)
})

//Success Dialouge Box Pop-up
ipc.on('succes-dialog', function (event, message) {
    const options = {
        title: "Success",
        message: message,
        button: ['okay']
    }
    dialog.showMessageBox(null, options)
})

//Starting Game
ipc.on('start-game', function (event, tableNumber, status, gameType, id1, id2, id3, id4, id5, id6, id7, id8, id9, id10, startTime, createDate) {
    connections.startGame(tableNumber, status, gameType, id1, id2, id3, id4, id5, id6, id7, id8, id9, id10, startTime, createDate).then(result => {
        if (result === true) {
            getAllCustomers();
            getAllOngoingGames();
        }

    });

})

//Add Employee
ipc.on('add-employee',function(event, employeeName, employeeDesignation, employeeCNIC, employeeAddress, employeePhone, employeeBasicPay, createDate){
    connections.addEmployee(employeeName, employeeDesignation, employeeCNIC, employeeAddress, employeePhone, employeeBasicPay, createDate).then(result=>
        {
            if(result===true)
            {
                dialog.showErrorBox("Success","New Employee Added")
                event.sender.send('Reload Employees','New Employee Added');
            }
            
        });
    
})

//Add Employee
ipc.on('add-employee-advance',function(event, employeeId, advanceAmount){
    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const currentDate = yyyy + '-' + mm + '-' + dd;
    connections.addAdvanceEmployee(currentDate,employeeId, advanceAmount).then(result=>
        {
            if(result===true)
            {  
                dialog.showErrorBox("Success","Advance Amount Added")
                event.sender.send('Reload Employees','Advance Changed');
            }
            
        });
    
})


//Pay Employee Salary
ipc.on('pay-employee-salary', function (event, employeeId,salaryMonth, salaryAmount,salaryNote, advanceDeductionAmount, createDate) {
    connections.paySalaryEmployee(employeeId,salaryMonth, salaryAmount,salaryNote, advanceDeductionAmount, createDate).then(result => {
        if (result === true) {
            dialog.showErrorBox("Success", "Salary Added")
            event.sender.send('Reload Employees','Salary Paid');
        }

    });

})


//Add Customer
ipc.on('add-customer', function (event, customerName, customerAddress, customerPhone, createDate) {
    connections.addCustomer(customerName, customerAddress, customerPhone, createDate).then(result => {
        if (result === true) {
            getAllCustomers();
            getAllOngoingGames();

        }

    });

})


//Add Expense
ipc.on('add-expense', function (event, expenseName, expenseDescription, expenseAmount, createDate,expenseCategoryId) {
    connections.addExpense(expenseName,expenseDescription,expenseAmount,createDate,expenseCategoryId).then(result => {
        if (result === true) {
            const options = {
                title: "Success",
                message: "message",
                button: ['okay']
            }
            dialog.showMessageBox(null, options)
        }

    });

})


//Get Expense
ipc.on('get-expense', function (event) {
    connections.getExpense().then(rows => {
        event.sender.send("expense", rows);
    });
})

//Get Expense Category
ipc.on('get-expense-category', function (event) {
    connections.getExpenseCategory().then(rows => {
        event.sender.send("expenseCategory", rows);
    });
})


//Get Inventory Category
ipc.on('get-inventory-category', function (event) {
    connections.getInventoryCategory().then(rows => {
        event.sender.send("inventoryCategory", rows);
    });
})

//Get Revenue
ipc.on('get-revenue', function (event) {
    connections.getRevenue().then(rows => {
        event.sender.send("revenue", rows);
    });
})

//Delete Customer
ipc.on('delete-customer', function (event, customerId) {
    connections.deleteCustomer(customerId).then(result => {
        if (result === true) {
            getAllCustomers()
            getAllOngoingGames();
        }

    });

})

//Add Order
ipc.on('add-order', function (event, selectedItem, gameId, customerId, quantity, amount) {
    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const currentDate = yyyy + '-' + mm + '-' + dd;
    connections.addOrder(currentDate, currentDate, selectedItem, gameId, customerId, quantity, amount);
})

//Add Order Others
ipc.on('add-order-others', function (event, gameId, customerId, categoryName, itemName, amount) {
    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const currentDate = yyyy + '-' + mm + '-' + dd;
    connections.addOrderOthers(currentDate, gameId, customerId, categoryName, itemName, amount);
})

//Pay Bill
ipc.on('pay-bill', function (event, status, creditAmount, customerId, ...billIdArray) {
    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const currentDate = yyyy + '-' + mm + '-' + dd;
    connections.payBill(currentDate, status, creditAmount, customerId, ...billIdArray);
})

//Clear Credit
ipc.on('clear-credit', function (event, customerId, clearedAmount) {
    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const currentDate = yyyy + '-' + mm + '-' + dd;
    connections.clearCredit(currentDate, customerId, clearedAmount);
})

//End Game
ipc.on('end-game', function (event, gameId, amount, loserId1, loserId2) {
    const today = new Date();
    const endTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const updateDate = yyyy + '-' + mm + '-' + dd;
    connections.endGame(updateDate, updateDate, gameId, amount, loserId1, loserId2, endTime).then(result => {
        if (result === true) {
            getAllCustomers();
            getAllOngoingGames();
        }

    });

})

//Get Creditors
ipc.on('get-creditors', function (event) {
    connections.getCreditors().then(rows => {
        event.sender.send("creditors", rows);
    });
})

//Get Credit History
ipc.on('get-credit-history',function(event,customerId)
{
    connections.getCreditHistory(customerId).then(rows => {
        event.sender.send("creditor-history", rows);
    });
})

//Get Employees Data
ipc.on('employee', function (event) {
    connections.getEmployees().then(rows => {
        event.sender.send("employee Data", rows);
    });
})

//Get Salary History
ipc.on('get-salary', function (event,employeeId) {
    connections.getSalary(employeeId).then(rows => {
        event.sender.send("salary", rows);
    });
})

//Get Inventory
ipc.on('get-inventory', function (event,inventoryCategoryId) {
    connections.getInventory(inventoryCategoryId).then(rows => {
        event.sender.send("Stock", rows);
    });
})



//Add New Inventory Item
ipc.on('add-new-inventory-item', function(event,newItemName,newItemPrice,newItemQuantity,inventoryCategorId){
    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const currentDate = yyyy + '-' + mm + '-' + dd;
    connections.addInventoryItem(currentDate,newItemName,newItemPrice,newItemQuantity,inventoryCategorId).then(result => {
        if (result === true) {
            // event.sender.send('Reload Inventory','New Item Added');
            dialog.showErrorBox("Success","New Item Added")
            
        }
        else
        {
            dialog.showErrorBox("Error",result)
        }

    });

})

//Update Stovk
ipc.on('update-stock', function(event,itemName,quantity){
    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const currentDate = yyyy + '-' + mm + '-' + dd;
    connections.updateStock(currentDate,itemName,quantity).then(result => {
        if (result === true) {
            // event.sender.send('Reload Inventory','New Item Added');
            dialog.showErrorBox("Success","Inventory Updated")
            
        }
        

    });

})

//Get table Data (Drinks, Cigarettes, Kitchen, Miscellaneous)
ipc.on('get-table-data', function (event,gameId) {
    connections.getTableData(gameId).then(rows => {
        event.sender.send("table-data", rows);
    });
})

//Get report Data
ipc.on('get-report-data', function (event,selectedDate) {
    connections.getReportData(selectedDate).then(rows => {
        event.sender.send("report-data", rows);
    });
})

//Get daily expense Data for report
ipc.on('get-daily-expense-report', function (event,selectedDate) {
    connections.getDailyExpenseReportData(selectedDate).then(rows => {
        event.sender.send("daily-expense-report", rows);
    });
})


//Get Bill For Customer
ipc.on('generate-bill', function (event, customerId) {
    connections.generateBill(customerId).then(result => {
        console.log(result)
        let finalResult = [];
        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result[i].length; j++) {
                if (result[i][j].gameType) {
                    finalResult.push({
                        item: result[i][j].revenueDescription + " ( Table " + result[i][j].tableNo + " )",
                        price: result[i][j].amount,
                        time_quantity: result[i][j].startTime,
                        billId: result[i][j].billId
                    })
                }
                else if (result[i][j].revenueDescription) {
                    if (result[i][j].tableNo) {
                        finalResult.push({
                            item: result[i][j].revenueDescription + " ( Table " + result[i][j].tableNo + " )",
                            price: result[i][j].amount,
                            time_quantity: 1,
                            billId: result[i][j].billId
                        })
                    }
                    else {
                        finalResult.push({
                            item: result[i][j].revenueDescription,
                            price: result[i][j].amount,
                            time_quantity: 1,
                            billId: result[i][j].billId
                        })
                    }
                }
                else {
                    if (result[i][j].tableNo) {
                        finalResult.push({
                            item: result[i][j].itemName + " ( Table " + result[i][j].tableNo + " )",
                            price: result[i][j].amount,
                            time_quantity: result[i][j].quantity,
                            billId: result[i][j].billId
                        })
                    }
                    else {
                        finalResult.push({
                            item: result[i][j].itemName,
                            price: result[i][j].amount,
                            time_quantity: result[i][j].quantity,
                            billId: result[i][j].billId
                        })
                    }

                }
            }

        }
        console.log(finalResult)
        event.sender.send("generated-bill", finalResult)

    })
})

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win == null) {
        createWindow()
    }
})

//Gets All Customers
function getAllCustomers() {
    connections.getCustomers().then(rows => {
        global.sharedObj.players = rows;
        global.sharedObj.allplayers = rows;
        console.log("All Customers Fetched From DB")
    });
}

//Gets All ongoing Games on All Tables
function getAllOngoingGames() {
    connections.getOngoingGames().then(result => {
        for (let i = 0; i < result.length; i++) {
            //Check if Each Table Has ongoing game
            if (result[i].length > 0) {
                global.sharedObj.status[i] = 'Ongoing - ' + result[i][0].gameType;
                global.sharedObj.games[i] = result[i][0];
                Object.values(global.sharedObj.games[i]).forEach(function (value, index) {
                    if (index > 5 && index < 16) {

                        if (value !== null) {
                            if ((global.sharedObj.currentPlayers.filter(currentPlayer => (currentPlayer.customerId === value))).length === 0) {
                                const player = global.sharedObj.players.filter((player => (player.customerId === (value))));
                                global.sharedObj.currentPlayers.push(player[0]);
                                global.sharedObj.players = global.sharedObj.players.filter(currentPlayer => (currentPlayer !== player[0]));
                            }


                        }
                    }
                });
            }
            else {
                global.sharedObj.status[i] = 'Vacant'
                global.sharedObj.games[i] = null;
            }
        }
        win.webContents.send('Reload', 'New Data')
    })

}
getAllCustomers();
getAllOngoingGames();

