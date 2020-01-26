// const { remote } = require('electron');
// const electron = require('electron');
var connections;
if (connections == null) {
    connections = require('../DataBaseOperations/connections.js')
}

// let ipc = electron.ipcRenderer;
var win;
if (win == null) {
    win = remote.getGlobal('win')
}
window.$ = window.jQuery = require('jquery');
require('datatables.net-dt')();

// var allplayers;
// var currentPlayers;
// if(allplayers==null){
//     allplayers = remote.getGlobal('sharedObj').allplayers;
//     currentPlayers = remote.getGlobal('sharedObj').currentPlayers;
// } 


var data = [];
var jsonData = [{
        Date: "1-06-2020",
        Drinks: "2000",
        Credit_Clear: "200",
        Cigarette: "5600",
        Grand_Total: "24000",
        Net_Total: "22000",
        Over: "250",
        Cash: "21000"
    },
    {
        Date: "1-06-2020",
        Drinks: "2000",
        Credit_Clear: "200",
        Cigarette: "5600",
        Grand_Total: "24000",
        Net_Total: "22000",
        Over: "250",
        Cash: "21000"
    },
    {
        Date: "1-06-2020",
        Drinks: "2000",
        Credit_Clear: "200",
        Cigarette: "5600",
        Grand_Total: "24000",
        Net_Total: "22000",
        Over: "250",
        Cash: "21000"

    }



]
for (let i = 0; i < jsonData.length; i++) {
    data.push(jsonData[i])
}

console.log(data)



$(document).ready(function () {
    $('#example').dataTable({
        data: data,
        "columns": [{
                data: "Date"
            },
            {
                data: "Drinks"
            },
            {
                data: "Credit_Clear"
            },
            {
                data: "Cigarette"
            },
            {
                data: "Grand_Total"
            },
            {
                data: "Net_Total"
            },
            {
                data: "Over"
            },
            {
                data: "Cash"
            }
        ]
    })
});