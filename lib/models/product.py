from .driver import DriverDB
import pyodbc
import json


class ProductModel(DriverDB):

    # Извлечение данных о всех товарах
    @staticmethod
    def get_all_goods():
        sql_query = '''
            SELECT b.book_id, b.title, b.year_of_publishing, b.isbn, b.img, b.price, b.general_count, a.author, 
                   p.publisher, g.genre, lang.language
            FROM books b
            INNER JOIN authors a ON a.author_id = b.author_id
            INNER JOIN publishers p ON p.publisher_id = b.publisher_id
            INNER JOIN genres g ON g.genre_id = b.genre_id
            INNER JOIN languages lang ON lang.language_id = b.language_id
            ORDER BY title
            '''
        conn = pyodbc.connect('Driver={SQL Server};'
                              'Server=' + DriverDB.server + ';'
                              'Database=' + DriverDB.database + ';'
                              'Trusted_Connection=yes;'
                              'UID=' + DriverDB.username + ';'
                              'PID=' + DriverDB.password + ';')
        cursor = conn.cursor()
        cursor.execute(sql_query)
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        spec_dict = {}
        for t in result:
            spec_dict[t[0]] = {
                "book_id": t[0],
                "title": t[1],
                "year_of_publishing": t[2],
                "isbn": t[3],
                "img": t[4],
                "price": t[5],
                "general_count": t[6],
                "author": t[7],
                "publisher": t[8],
                "genre": t[9],
                "language": t[10]
            }

        json_list = json.dumps(spec_dict, ensure_ascii=False).encode('utf-8')
        json_list = json_list.decode('windows-1251')
        with open('static/json/all_goods.json', 'w+') as fout:
            fout.write(str(json_list))
        return result

    @staticmethod
    def create_order(username, email, tel_number, purchase_date, cart_ids, cart_amounts):
        sql_query_check_username = '''
                    IF (SELECT COUNT(1) FROM [usernames] WHERE [username]=?)=0
                        BEGIN
                            INSERT INTO [usernames] 
                                ([username])
                            VALUES
                                (?)
                        END
                                   '''
        sql_query_check_user = '''
                    IF (SELECT COUNT(1) FROM [users] WHERE [email]=?)=0
                        BEGIN
                            INSERT INTO [users]
                                ([username_id], [email], [tel_number])
                            VALUES
                                ((SELECT [username_id]
                                  FROM [usernames]
                                  WHERE [username]=?), ?, ?)
                        END
                    ELSE
                        BEGIN
                            UPDATE [users]
                            SET [username_id]=(SELECT [username_id]
                                               FROM [usernames]
                                               WHERE [username]=?),
                                [tel_number]=?
                            WHERE [email]=?
                        END
                               '''
        sql_query_add_order = '''
                    INSERT INTO [orders]
                        ([user_id_], [purchase_date])
                    VALUES
                        ((SELECT [user_id_]
                          FROM [users]
                          WHERE [email]=?), ?)
                             '''
        sql_query_add_goods_from_orders = '''
                    INSERT INTO [order_contents]
                        ([order_id], [book_id], [book_count])
                    VALUES
                        ((SELECT [order_id]
                          FROM [orders]
                          WHERE [purchase_date]=?), ?, ?)
                        
                                          '''
        conn = pyodbc.connect('Driver={SQL Server};'
                              'Server=' + DriverDB.server + ';'
                              'Database=' + DriverDB.database + ';'
                              'Trusted_Connection=yes;'
                              'UID=' + DriverDB.username + ';'
                              'PID=' + DriverDB.password + ';')
        cursor = conn.cursor()
        cursor.execute(sql_query_check_username, (username, username))
        conn.commit()
        cursor.execute(sql_query_check_user, (email, username, email, tel_number, username, tel_number, email))
        conn.commit()
        cursor.execute(sql_query_add_order, (email, purchase_date))
        conn.commit()
        for i in range(len(cart_ids)):
            cursor.execute(sql_query_add_goods_from_orders, (purchase_date, cart_ids[i], cart_amounts[i]))
            conn.commit()
        cursor.close()
        conn.close()
