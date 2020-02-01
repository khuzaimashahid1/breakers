
require('datatables.net-dt')();
var  data = [];
var reportTable, selectedDate;
var jsonData = []
initializeTables();


    


//Get report data
function getReportData(selectedDate)
{
    
    

    // jsonData=[]
    //Get Salary from Main Process IPC
    ipc.send('get-report-data',selectedDate);
    ipc.once('report-data', (event, reportData) => 
    {
        jsonData=[]
        var reportObject={
            KitchenSale:0,
            DrinksSale:0,
            CigarettesSale:0,
            MiscSale:0,
            TableSale:0,
            CreditClear:0,
            GrandTotal:0,
            NetSale:0
        }
        console.log(reportData)
        for (let i = 0; i < reportData.length; i++) {
            
            if(reportData[i].revenueName=="Kitchen Sale"){
                reportObject.KitchenSale=reportData[i].totalRevenue;
            }
            if(reportData[i].revenueName=="Drinks Sale"){
                reportObject.DrinksSale=reportData[i].totalRevenue;
            }
            if(reportData[i].revenueName=="Cigarettes Sale"){
                reportObject.CigarettesSale=reportData[i].totalRevenue;
            }
            if(reportData[i].revenueName=="Misc Sale"){
                reportObject.MiscSale=reportData[i].totalRevenue;
            }
            if(reportData[i].revenueName=="Games Sale"){
                reportObject.TableSale=reportData[i].totalRevenue;
            }
            
        }

        
        jsonData.push(reportObject)
        
        reportTable.clear().rows.add(jsonData).draw();

        console.log(reportObject);
    })

}

function generateSummary()
{
    selectedDate= $('#selectedDate').val()
    console.log(selectedDate)
    getReportData(selectedDate);
}


// var jsonData = 
// [
//     {
//         Date: "1-06-2020",
//         Kitchen: "2000",
//         Drinks: "2000",
//         Cigarettes: "5600",
//         Tables: "5600",
//         Credit_Clear: "200",
//         Grand_Total: "24000",
//         Net_Total: "22000",
//     },
//     {
//         Date: "1-06-2020",
//         Kitchen: "2000",
//         Drinks: "2000",
//         Cigarettes: "5600",
//         Tables: "5600",
//         Credit_Clear: "200",
//         Grand_Total: "24000",
//         Net_Total: "22000",
//     },
//     {
//         Date: "1-06-2020",
//         Kitchen: "2000",
//         Drinks: "2000",
//         Cigarettes: "5600",
//         Tables: "5600",
//         Credit_Clear: "200",
//         Grand_Total: "24000",
//         Net_Total: "22000",
//     }
// ]
// for (let i = 0; i < jsonData.length; i++) {
//     data.push(jsonData[i])
// }

// console.log(data)


// Initialize Datatables
function initializeTables() {
$(document).ready(function () {
    reportTable=$('#report').DataTable({
        scrollY:'50vh',
        scrollCollapse: true,
        paging:true,
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
                data: "NetSale"
            }
        ]
    })

    getReportData();
});

}