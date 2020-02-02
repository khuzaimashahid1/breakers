
require('datatables.net-dt')();
var  data = [];
var reportTable, selectedDate;
var jsonData = []
initializeTables();



//Get report data
function getReportData(selectedDate) {
    jsonData = []
    var reportObject = {
        KitchenSale: 0,
        DrinksSale: 0,
        CigarettesSale: 0,
        MiscSale: 0,
        TableSale: 0,
        CreditClear: 0,
        GrandTotal: 0,
        Expense: 0,
        NetSale: 0
    }

    ipc.send('get-report-data', selectedDate);
    ipc.once('report-data', (event, reportData) => {

        console.log(reportData)
        for (let i = 0; i < reportData.length; i++) {

            if (reportData[i].revenueName == "Kitchen Sale") {
                reportObject.KitchenSale = reportData[i].totalRevenue;
                reportObject.GrandTotal += reportData[i].totalRevenue;
            }
            if (reportData[i].revenueName == "Drinks Sale") {
                reportObject.DrinksSale = reportData[i].totalRevenue;
                reportObject.GrandTotal += reportData[i].totalRevenue;
            }
            if (reportData[i].revenueName == "Cigarettes Sale") {
                reportObject.CigarettesSale = reportData[i].totalRevenue;
                reportObject.GrandTotal += reportData[i].totalRevenue;
            }
            if (reportData[i].revenueName == "Misc Sale") {
                reportObject.MiscSale = reportData[i].totalRevenue;
                reportObject.GrandTotal += reportData[i].totalRevenue;
            }
            if (reportData[i].revenueName == "Games Sale") {
                reportObject.TableSale = reportData[i].totalRevenue;
                reportObject.GrandTotal += reportData[i].totalRevenue;
            }

        }
        ipc.send('get-daily-expense-report', selectedDate);
        ipc.once('daily-expense-report', (event, expenseReportData) => {
            console.log(expenseReportData)
            if (expenseReportData[0].expense != null) {
                reportObject.Expense = expenseReportData[0].expense;
                reportObject.NetSale = reportObject.GrandTotal - reportObject.Expense;
            }
            jsonData.push(reportObject)
            console.log(reportObject);

            reportTable.clear().rows.add(jsonData).draw();
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
    reportTable=$('#report').DataTable({
        
        data: jsonData,
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
                data: "TableSale"
            },
            {
                data: "CreditClear"
            },
            {
                data: "GrandTotal"
            },
            {
                data: "Expense"
            },
            {
                data: "NetSale"
            }
        ]
    })

});

}