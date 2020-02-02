
require('datatables.net-dt')();
var  data = [];
var revenueTable,expenseTable, selectedDate;
var revenueData = []
var expenseData = []
initializeTables();



//Get report data
function getReportData(selectedDate) {
    revenueData = []
    expenseData = []
    var revenueReportObject = {
        KitchenSale: 0,
        DrinksSale: 0,
        CigarettesSale: 0,
        MiscSale: 0,
        OtherInventory: 0,
        TableSale: 0,
        CreditClear: 0,
    }
    
    var expenseReportObject = {
        KitchenExpense: 0,
        CreditAmount: 0,
        RemainingAmount: 0,
        ClubExpense: 0,
        OutExpense: 0
    
    }
    
    
    var auditReportObject = {
        GrandTotal: 0,
        ExpenseTotal: 0,
        NetSale: 0
    }
    

    // Get Revenue for all categories
    ipc.send('get-report-data', selectedDate);
    ipc.once('report-data', (event, revenueReportData) => {

        // console.log(revenueReportData)
        for (let i = 0; i < revenueReportData.length; i++) {

            if (revenueReportData[i].revenueName == "Kitchen Sale") {
                revenueReportObject.KitchenSale = revenueReportData[i].totalRevenue;
                auditReportObject.GrandTotal += revenueReportData[i].totalRevenue;
            }
            if (revenueReportData[i].revenueName == "Drinks Sale") {
                revenueReportObject.DrinksSale = revenueReportData[i].totalRevenue;
                auditReportObject.GrandTotal += revenueReportData[i].totalRevenue;
            }
            if (revenueReportData[i].revenueName == "Cigarettes Sale") {
                revenueReportObject.CigarettesSale = revenueReportData[i].totalRevenue;
                auditReportObject.GrandTotal += revenueReportData[i].totalRevenue;
            }
            if (revenueReportData[i].revenueName == "Misc Sale") {
                revenueReportObject.MiscSale = revenueReportData[i].totalRevenue;
                auditReportObject.GrandTotal += revenueReportData[i].totalRevenue;
            }
            if (revenueReportData[i].revenueName == "Other Inventory Sale") {
                revenueReportObject.OtherInventory = revenueReportData[i].totalRevenue;
                auditReportObject.GrandTotal += revenueReportData[i].totalRevenue;
            }
            if (revenueReportData[i].revenueName == "Games Sale") {
                revenueReportObject.TableSale = revenueReportData[i].totalRevenue;
                auditReportObject.GrandTotal += revenueReportData[i].totalRevenue;
            }
            if (revenueReportData[i].revenueName == "Credit Clear") {
                revenueReportObject.CreditClear = revenueReportData[i].totalRevenue;
                auditReportObject.GrandTotal += revenueReportData[i].totalRevenue;
            }

        }

        revenueData.push(revenueReportObject)
        console.log(revenueData);
        revenueTable.clear().rows.add(revenueData).draw();
        $("#GrandTotal").html(auditReportObject.GrandTotal + " PKR")


        // Get Club and Out Expense 
        ipc.send('get-daily-expense-report', selectedDate);
        ipc.once('daily-expense-report', (event, expenseReportData) => {
            console.log(expenseReportData)
            for (let i = 0; i < expenseReportData.length; i++) {


                if (expenseReportData[i].expenseName == "Club Expense") {
                    expenseReportObject.ClubExpense = expenseReportData[i].amount;
                    auditReportObject.ExpenseTotal += expenseReportData[i].amount;
                }
                if (expenseReportData[i].expenseName == "Out Expense") {
                    expenseReportObject.OutExpense = expenseReportData[i].amount;
                    auditReportObject.ExpenseTotal += expenseReportData[i].amount;
                }


            }

            // As the kitchen sale dose not have profit so we are using same revenue data
            console.log("revenueReportObject.KitchenSale" + revenueReportObject.KitchenSale)
            if (revenueReportObject.KitchenSale != 0) {
                expenseReportObject.KitchenExpense = revenueReportObject.KitchenSale;
                auditReportObject.ExpenseTotal += revenueReportObject.KitchenSale;
            }
            // Get Expense Credit Amount 
            ipc.send('get-daily-credit-report', selectedDate);
            ipc.once('daily-credit-report', (event, creditExpenseReportData) => {
                console.log(creditExpenseReportData)
                if (creditExpenseReportData[0].creditAmount != null) {
                    expenseReportObject.CreditAmount = creditExpenseReportData[0].creditAmount;
                    auditReportObject.ExpenseTotal += creditExpenseReportData[0].creditAmount;
                }

                // Get Expense Remaining Amount
                ipc.send('get-daily-remaining-report', selectedDate);
                ipc.once('daily-remaining-report', (event, remainingExpenseReportData) => {
                    console.log(remainingExpenseReportData)
                    if (remainingExpenseReportData[0].remainingAmount != null) {
                        expenseReportObject.RemainingAmount = remainingExpenseReportData[0].remainingAmount;
                        auditReportObject.ExpenseTotal += remainingExpenseReportData[0].remainingAmount;
                    }
                    expenseData.push(expenseReportObject)
                    console.log(expenseData);

                    expenseTable.clear().rows.add(expenseData).draw();
                    auditReportObject.NetSale = auditReportObject.GrandTotal - auditReportObject.ExpenseTotal;
                    console.log("auditReportObject.GrandTotal" + auditReportObject.GrandTotal)
                    console.log("auditReportObject.NetSale" + auditReportObject.NetSale)
                    $("#ExpenseTotal").html(auditReportObject.ExpenseTotal + " PKR")
                    $("#NetTotal").html(auditReportObject.NetSale + " PKR")
                })

            })

        })
    })
        

        

        



}

function generateSummary()
{
    selectedDate= $('#selectedDate').val()
    console.log(selectedDate)
    getReportData(selectedDate);
}



// Initialize Datatables
function initializeTables() {
$(document).ready(function () {
    // Revenue Report Table
    revenueTable=$('#revenueReport').DataTable({
        
        data: revenueData,
        "columns": [
            {
                data: "KitchenSale"
            },
            {
                data: "DrinksSale"
            },
            {
                data: "CigarettesSale"
            },
            {
                data: "MiscSale"
            },
            {
                data: "OtherInventory"
            },
            {
                data: "TableSale"
            },
            {
                data: "CreditClear"
            }
        ]
    })

    // Expense Report Table
    expenseTable=$('#expenseReport').DataTable({
        
        data: expenseData,
        "columns": [
            {
                data: "KitchenExpense"
            },
            {
                data: "CreditAmount"
            },
            {
                data: "RemainingAmount"
            },
            {
                data: "ClubExpense"
            },
            {
                data: "OutExpense"
            }
        ]
    })
});

}
