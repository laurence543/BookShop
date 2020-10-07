var cart = {};
var param=document.getElementById("order-button");
$.getJSON('static/json/all_goods.json', function (data) {
    var goods = data;
    //console.log(goods);
    checkCart();
    //console.log(cart);
    showCart();

    function showCart() {
        if ($.isEmptyObject(cart)){
            //Кошик порожній
            let out = 'Кошик порожній. Додайте товар до кошику.';
            $('#my-cart').html(out);
            param.style.display = "none";
        }
        else {
            let out = '<table class="table-cart" style="align-self: auto"><tr>';
            out += '<tr><td colspan="3">Товар</td><td>Кількість</td><td class="cost">Ціна</td><tr>'
            for (let key in cart){
                //out += key + '---' + cart[key] + '<br>';
                out += '<tr>';
                out += '<td><button class="delete" data-art="'+key+'">x</button></td>';
                out += '<td><img src="../../static/img/goods/' + goods[key]['img'] +'"></td>'
                out += '<td>' + goods[key]['title'] + '</td>';
                out += '<td><button class="minus" data-art="'+key+'">-</button>';
                out += '<span class="count">' + cart[key] + '</span>';
                out += '<button class="plus" data-art="'+key+'">+</button></td>';
                out += '<td class="cost">' + cart[key]*goods[key]['price'] + '</td>';
                // out += '<br>';
                out += '</tr>';
            }
            out += '</table>';
            $('#my-cart').html(out);
            $('.plus').on('click', plusGoods);
            $('.minus').on('click', minusGoods);
            $('.delete').on('click', deleteGoods);
            param.style.display = "block";
        }
    }
    function plusGoods() {
        var article = $(this).attr('data-art');
        cart[article]++;
        saveCartToLocalStorage(); // Зберігаємо значення змінної cart в Local Storage
        showCart();
    }
    function minusGoods() {
        let article = $(this).attr('data-art');
        if (cart[article] > 1){
            cart[article]--;
        }
        else {
            delete cart[article];
        }
        saveCartToLocalStorage();
        showCart();
    }
    function deleteGoods() {
        let article = $(this).attr('data-art');
        delete cart[article];
        saveCartToLocalStorage();
        showCart();
    }
});
function checkCart() {
    //Перевірка кошику в localStorage;
    if (localStorage.getItem('cart') != null) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
}
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}