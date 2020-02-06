require('datatables.net-dt')();

var unpaidTable, unpaidArray = [];

//Function Calls for intialization
initializeTables();

ipc.once('Reload', (event, message) => {
    getUnpaid();
})

//Fetching Expense From DB
function getUnpaid() {

    ipc.send('get-unpaid');
    ipc.once('unpaid', (event, unpaid) => {
        for (let i = 0; i < unpaid.length; i++) {
            unpaidArray.push(unpaid[i])
        }
        unpaidTable.clear().rows.add(unpaidArray).draw();
    })
}



//Initialize DataTables
function initializeTables()
{
$(document).ready(function () {

    
    // Revenue DataTable
    unpaidTable=$('#Unpaid').DataTable({
        scrollY:'50vh',
        scrollCollapse: true,
        paging:true,
        data: unpaidArray,
        "columns": [
            {
                data: "name"
            },
            {
                data: "amount"
            }
        ]
    })
    getUnpaid();
});

}
