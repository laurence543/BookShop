var cart = {};

$.getJSON('static/json/all_goods.json', function (data) {
    let goods = data;
    //console.log(goods);
    checkCart();
    //console.log(cart);
    showHiddenCart();

    function showHiddenCart() {
        //let out1 = '';
        let out2 = '';
        let out3 = '';
        //let out4 = '';
        //out1 += '<input type="text" id="title_of_product_in_cart" name="title_of_product_in_cart" value="';
        out2 += '<input type="hidden" id="book_id_of_product_in_cart" name="book_id_of_product_in_cart" value="';
        out3 += '<input type="hidden" id="amount_of_product_in_cart" name="amount_of_product_in_cart" value="';
        //out4 += '<input type="text" id="total_cost_of_product_in_cart" name="total_cost_of_product_in_cart" value="';
        for (let key in cart) {
            //out += key + '---' + cart[key] + '<br>';
            //out1 += goods[key]['title'] + ',,,';
            out2 += key + ',,,';
            out3 += cart[key] + ',,,';
            //out4 += cart[key] * goods[key]['price'] + ',,,';
        }
        //out1 += '">';
        out2 += '">';
        out3 += '">';
        //out4 += '">';
        var out_general = out2 + out3;
        $('#my-hidden-cart').html(out_general);
    }
});
function checkCart() {
    //Перевірка кошику в localStorage;
    if (localStorage.getItem('cart') != null) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
}
