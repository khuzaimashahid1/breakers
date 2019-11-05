function PlaceOrder(){
    var form = document.querySelector('form')
    form.addEventListener('change',function(){
        var name = document.getElementById("name")
        var item = document.getElementById("orderItem")
        var price = document.getElementById("price")
        console.log(name.value)
        console.log(item.value)
        console.log(price.value)
    })
}