const { BrowserWindow } = require('electron').remote
const { remote } =require('electron');
const electron= require('electron');
const ipc = electron.ipcRenderer;
require('datatables.net-dt')();
window.$ = window.jQuery = require('jquery');
let tableNumber = remote.getGlobal('sharedObj').tableNumber
populatingTableSummary(tableNumber);
var summaryData=[];
var summaryTable;



//Getting Inventory
function populatingTableSummary(tableNumber)
{
    $(document).ready(function () {
      summaryTable=$('#tableSummary').DataTable({
        data: summaryData,
        "columns": [
            {
                data: "createDate"
            },
            {
                data: "customerName"
            },
            {
                data: "startTime"
            },
            {
                data: "endTime"
            },
            {
                data: "amount"
            }
    
        ]
    })
    getTablesSummary(tableNumber)
    });
    
}

function getTablesSummary(tableNumber)
{
    ipc.send('get-tables-summary',tableNumber)
    ipc.once('tables-summary',(event,data)=>
  {
    for (let i = 0; i < data.length; i++) {
        // converting json to array for datatables
        summaryData.push(data[i])

    }
    summaryTable.clear().rows.add(summaryData).draw();
  })   
  console.log(summaryData)
}