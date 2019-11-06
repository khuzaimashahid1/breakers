const { remote } =require('electron');
const electron= require('electron');
let ipc = electron.ipcRenderer;
let win = remote.getGlobal('win')

function placeOrder(){

    //Button click event capture
        var name = document.getElementById("name").value
        var item = document.getElementById("orderItem").value
        var price = document.getElementById("price").value
        console.log(name)
        console.log(item)
        console.log(price)
        if(name!=''&&item!=''&&price!=''){
            ipc.send('place-drink-order',name,item,price)
            remote.getCurrentWindow().reload()
        }
        else{
            ipc.send('error-dialog',"Empty fields")
        }
}