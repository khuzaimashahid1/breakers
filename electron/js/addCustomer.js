const { remote } = require('electron');
const electron = require('electron');
const connections=require('../DataBaseOperations/connections.js')
let ipc = electron.ipcRenderer;
let win = remote.getGlobal('win')
window.$ = window.jQuery = require('jquery');
require( 'datatables.net-dt' )();
let allplayers = remote.getGlobal('sharedObj').allplayers;
let currentPlayers = remote.getGlobal('sharedObj').currentPlayers;



function openModal()
{
  
  // Get the modal
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
      modal.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }

}

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


console.log(allplayers);


let data=[]
for(let i=0;i<allplayers.length;i++)
{
    data.push(allplayers[i])
}

console.log(data)


// Edit record
$('#example').on('click', 'a.editor_edit', function (e) {
    e.preventDefault();

    console.log("editor_edit")

} );

// Delete a record
$('#example').on('click', 'a.editor_remove', function (e) {
    e.preventDefault();
    console.log("remove")
    console.log($('#Edit').attr('href'));
    //ipc.send('delete-customer',10)
    
} );


$(document).ready(function() {
  $('#example').dataTable( {
    data: data,
    "columns": [
      { data: "customerId" },
      { data: "customerName" },
      { data: "customerAddress" },
      { data: "customerPhone" },
      { data: "createDate" },
      {
        data: null,
        className: "center",
        defaultContent: '<a href="abc" id="Edit" class="editor_edit">Edit</a> / <a href="" class="editor_remove">Delete</a>'
    }
    ]
  })
});



    