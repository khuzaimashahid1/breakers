//Function For adding customer
function placeOrder() {
    //Button click event capture
    var name = document.getElementById("name").value
    var item = document.getElementById("orderItem").value
    var price = document.getElementById("price").value
    if (name != '' && item != '' && price != '') 
    {
        ipc.send('place-drink-order', name, item, price)
        remote.getCurrentWindow().reload()
    }
    else 
    {
        ipc.send('error-dialog', "Empty fields")
    }
}