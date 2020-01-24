const { remote } = require('electron');
const electron = require('electron');
const connections=require('../DataBaseOperations/connections.js')
let ipc = electron.ipcRenderer;
let win = remote.getGlobal('win')
window.$ = window.jQuery = require('jquery');

function addCustomer()
{
    let customerName=$('#uname').val();
    let customerAddress=$('#address').val();
    let customerPhone=$('#phone').val();
    const today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const createDate = yyyy + '-' + mm + '-' + dd;
    ipc.send('add-customer',customerName,customerAddress,customerPhone,createDate)
}