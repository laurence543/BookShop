var cart = {}; //кошик
var x, y = 0;

$(document).ready(function () {
    clientXY(x, y);
    loadGoods();
    checkCart();
    showMiniCart();


})
function loadGoods() {
    $.getJSON('static/json/all_goods.json', function (data) {
        console.log(data);
        var out = '';
        for (var key in data){
            out+='<div class="single-goods">';
            out+= '<h3>'+data[key]['title']+'</h3>';
            out+='<img src="../../static/img/goods/'+data[key].img+'">';
            out+='<h4 class="details-hover" data-art="' +key+ '" data-title="' +data[key]['title']+
                '" data-genre="' +data[key]['genre']+ '" data-year="' +data[key]['year_of_publishing']+
                '" data-author="' +data[key]['author']+ '" data-publisher="' +data[key]['publisher']+
                '" data-language="' +data[key]['language']+ '" data-isbn="' +data[key]['isbn']+
                '" data-img="' +data[key]['img']+ '">Більше інформації</h4>';
            out+='<h2>'+data[key]['price']+' грн</h2>';
            if (data[key]['general_count'] > 0){
                out+='<button class="add-to-cart" data-art="'+key+'">Купити</button>';
            }
            else {
                out+='<span class="goods-absent">Товар відсутній';
            }

            out+='</div>';
        }
        $('#goods').html(out);
        $('button.add-to-cart').on('click', addToCart);
        $('.details-hover').mousemove(showHint).mouseout(hideHint);
    })
}
function addToCart() {
    var article = $(this).attr('data-art');
    if (cart[article] != undefined) {
        cart[article]++;
    }
    else {
        cart[article] = 1;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(cart);
    showMiniCart();
}
function checkCart() {
    //Перевірка кошику в localStorage;
    if (localStorage.getItem('cart') != null) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
}
function showMiniCart() {
    //вивід кошика
    var sum = 0;
    var out = '';
    for (p in cart) {
        sum += cart[p];
    }
    out += '<img src="../../static/img/shopping_cart.png" alt="Кошик">';
    out += '<span id="mini-cart-text">У кошику: ' + sum + ' товар(ів)</span>';
    $('#mini-cart').html(out);
}
function showHint() {
    var hint_id = $(this).attr('data-art');
    var hint_img = $(this).attr('data-img');
    var hint_title = $(this).attr('data-title');
    var hint_genre = $(this).attr('data-genre');
    var hint_year = $(this).attr('data-year');
    var hint_author = $(this).attr('data-author');
    var hint_publisher = $(this).attr('data-publisher');
    var hint_language = $(this).attr('data-language');
    var hint_general =  '<img src="../../static/img/goods/' + hint_img + '"><br>' +
                        'Назва: ' + hint_title + '<br>' +
                        'Жанр: ' + hint_genre + '<br>' +
                        'Рік видання: ' + hint_year + '<br>' +
                        'Автор: ' + hint_author + '<br>' +
                        'Видавництво: ' + hint_publisher + '<br>' +
                        'Мова книги: ' + hint_language + '<br>';

    $('#details-hidden').show().html(hint_general).css({'left': x, 'top': y + 70});

}
function hideHint() {
    $('#details-hidden').hide();
}
function clientXY(x, y) {
    window.onmousemove = function (event) {
        x = event.clientX;
        y = event.clientY;
        //console.log(x + "     " + y);
    }
}