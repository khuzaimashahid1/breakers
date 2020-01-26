require('datatables.net-dt')();


//Switching Customer Management Type
function openLink(evt, animName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("city");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" w3-white", "");
  }
  document.getElementById(animName).style.display = "block";
  evt.currentTarget.className += " w3-white";
}


//Functions For adding Customer
function addCustomer() {
  let customerName = $('#uname').val();
  let customerAddress = $('#address').val();
  let customerPhone = $('#phone').val();
  const today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  const createDate = yyyy + '-' + mm + '-' + dd;
  ipc.send('add-customer', customerName, customerAddress, customerPhone, createDate)
}

var data = []
for (let i = 0; i < allplayers.length; i++) {
  data.push(allplayers[i])
}

// Edit record
$('#customersTable').on('click', 'a.editor_edit', function (e) {
  e.preventDefault();

  console.log("editor_edit")

});

// Delete a record
$('#customersTable').on('click', 'a.editor_remove', function (e) {
  e.preventDefault();
  console.log("remove")
  console.log($('#Edit').attr('href'));
  //ipc.send('delete-customer',10)

});


$(document).ready(function () {
  $('#customersTable').dataTable({
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



