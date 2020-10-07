from flask import Flask, render_template, request
from lib.models.product import ProductModel
from time import strftime, localtime


def splitting(some_list):
    for i in some_list:
        if i == '':
            some_list.remove(i)


model = ProductModel()
app = Flask(__name__)

if __name__ == '__main__':
    app.run(debug=True)


@app.route('/')
def index():
    params = {
        'title': 'Головна',
        'content': 'general/index.html',
        'style': 'static/css/index.css',
    }
    return render_template('base.html', scope=params)


@app.route('/about')
def about():
    params = {
        'title': 'Про сайт',
        'content': 'general/about.html',
    }
    return render_template('base.html', scope=params)


@app.route('/contacts')
def contacts():
    params = {
        'title': 'Контакти',
        'content': 'general/contacts.html',
        'style': 'static/css/contacts.css',
    }
    return render_template('base.html', scope=params)


@app.route('/goods')
def goods_index():
    # your processing logic
    goods = model.get_all_goods()

    params = {
        'title': 'Каталог товарів',
        'content': 'goods/index.html',
        'style': 'static/css/goods.css',
        'script': 'static/js/goods.js',
        'goods': goods
    }
    return render_template('base.html', scope=params)


@app.route('/cart')
def goods_cart():
    # your processing logic
    params = {
        'title': 'Кошик',
        'content': 'goods/cart.html',
        'style': 'static/css/cart.css',
        'script': 'static/js/cart.js',
    }
    return render_template('base.html', scope=params)


@app.route('/cart_submitting', methods=['GET', 'POST'])
def cart_submitting():
    params = dict()
    if request.method == 'GET':
        params['title'] = 'Кошик'
        params['content'] = 'goods/cart_submitting.html'
        params['style'] = 'static/css/cart_submitting.css'
        params['script'] = 'static/js/cart_submitting.js'
        return render_template('base.html', scope=params)
    elif request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        tel_number = request.form['tel']
        cart_ids = request.form['book_id_of_product_in_cart'].split(',,,')
        cart_amounts = request.form['amount_of_product_in_cart'].split(',,,')
        splitting(cart_ids)
        splitting(cart_amounts)
        purchase_date = strftime('%Y-%m-%d %H:%M:%S', localtime())
        ProductModel.create_order(username, email, tel_number, purchase_date, cart_ids, cart_amounts)

        params['title'] = 'Кошик'
        params['content'] = 'goods/cart_submitting_report.html'
        params['style'] = 'static/css/cart_submitting_report.css'
        params['script'] = 'static/js/cart_submitting_report.js'
        return render_template('base.html', scope=params)
