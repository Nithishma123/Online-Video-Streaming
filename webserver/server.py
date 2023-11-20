"""
Columbia's COMS W4111.001 Introduction to Databases
Example Webserver
To run locally:
    python3 server.py
Go to http://localhost:8111 in your browser.
A debugger such as "pdb" may be helpful for debugging.
Read about it online.
"""
import os
from sqlalchemy import *
from sqlalchemy.pool import NullPool
from flask import Flask, request, render_template, g, redirect, Response, abort, jsonify, session
import logging
import hashlib

tmpl_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
app = Flask(__name__, template_folder=tmpl_dir, static_url_path='/static')
app.secret_key = 'testkey'
DATABASEURI = "postgresql://na3062:732244@34.74.171.121/proj1part2"

#
# This line creates a database engine that knows how to connect to the URI above.
#
engine = create_engine(DATABASEURI, future=True)

conn = engine.connect()


@app.before_request
def before_request():
    """
  This function is run at the beginning of every web request
  (every time you enter an address in the web browser).
  We use it to setup a database connection that can be used throughout the request.

  The variable g is globally accessible.
  """
    try:
        g.conn = engine.connect()
    except:
        print("uh oh, problem connecting to database")
        import traceback;
        traceback.print_exc()
        g.conn = None


@app.teardown_request
def teardown_request(exception):
    """
  At the end of the web request, this makes sure to close the database connection.
  If you don't, the database could run out of memory!
  """
    try:
        g.conn.close()
    except Exception as e:
        pass


#
# @app.route is a decorator around index() that means:
#   run index() whenever the user tries to access the "/" path using a GET request
#
# If you wanted the user to go to, for example, localhost:8111/foobar/ with POST or GET then you could use:
#
#       @app.route("/foobar/", methods=["POST", "GET"])
#
# PROTIP: (the trailing / in the path is important)
#
# see for routing: https://flask.palletsprojects.com/en/2.0.x/quickstart/?highlight=routing
# see for decorators: http://simeonfranklin.com/blog/2012/jul/1/python-decorators-in-12-steps/
#

def hash_password(password):
    # Use a cryptographic hash function (SHA-256 in this example)
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    return hashed_password


@app.route('/')
def index():
    # DEBUG: this is debugging code to see what request looks like
    print(request.args)

    #
    # example of a database query
    #
    cursor = g.conn.execute(text("SELECT name FROM test"))
    g.conn.commit()

    # 2 ways to get results

    # Indexing result by column number
    names = []
    for result in cursor:
        names.append(result[0])

    # Indexing result by column name
    names = []
    results = cursor.mappings().all()
    for result in results:
        names.append(result["name"])
    cursor.close()
    context = dict(data=names)

    return render_template("index.html", **context)


@app.route('/api/login', methods=['POST'])
def login():
    payload = request.get_json()
    username = payload.get('username')
    password = payload.get('password')
    cursor = g.conn.execute(text("select * from user_information where name= :username and password = :password"),
                            {'username': username, 'password': hash_password(password)})
    result = cursor.fetchall()
    cursor.close()
    if result:
        session['user_id'] = result[0][0]
        cursor = g.conn.execute(
            text("select * from user_information u left join monthly_subscriber m on m.user_id = u.user_id left join "
                 "annual_subscriber a on a.user_id = m.user_id where u.user_id= :user_id and (m.plan_expiry is not "
                 "null or "
                 "a.expiry is not null) "
                 ), {'user_id': session.get('user_id')}
        )
        res = cursor.fetchone()
        cursor.close()
        if res:
            session['is_subscriber'] = 1
        else:
            session['is_subscriber'] = 0
        return jsonify({'message': 'Login successful', 'status': 200}), 200
    else:
        return jsonify({'message': 'User not found', 'status': 400}), 400


@app.route('/api/signup', methods=['POST'])
def signup():
    payload = request.get_json()
    logging.debug(payload)
    name = payload.get('name')
    emailid = payload.get('emailid')
    phone = payload.get('phone')
    age = payload.get('age')
    gender = payload.get('gender')
    password = payload.get('pass')

    g.conn.execute(text("insert into user_information(name,email_id,phone_no,age,gender,password) values(:name,"
                        ":emailid, :phone, :age, :gender, :password)"),
                   {'name': name, 'emailid': emailid, 'phone': phone, 'age': age,
                    'gender': gender, 'password': hash_password(password)})
    g.conn.commit()
    return jsonify({'message': 'Login successful', 'status': 200}), 200


@app.route('/home.html')
def home_screen():
    return render_template('home.html')


@app.route('/api/subscriber')
def is_subscriber():
    return jsonify({'items': session.get('is_subscriber'), 'status': 'success'})


@app.route('/api/movies/<int:category_id>', methods=['GET'])
def get_all_movies(category_id):
    cursor = g.conn.execute(
        text("select v.name, v.description, v.duration, v.video_link,v.video_id, avg(re.rating) as rating "
             "from video_item_belongsto v "
             "left join rates r on r.video_id = v.video_id left join review re on re.review_id = "
             "r.review_id where v.category_id=:category_id "
             "group by re.rating, v.name, v.description, v.duration, v.video_link, v.video_id "
             "order by avg(re.rating) desc NULLS last"),
        {'category_id': category_id})
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    return jsonify({'items': items, 'status': 'success'})


@app.route('/api/categories', methods=['GET'])
def get_all_categories():
    cursor = g.conn.execute(text("select * from categories"))
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    return jsonify({'items': items, 'status': 'success'})


@app.route('/api/genres', methods=['GET'])
def get_all_genres():
    cursor = g.conn.execute(text("select * from genre"))
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    return jsonify({'items': items, 'status': 'success'})


@app.route('/api/cast', methods=['GET'])
def get_all_cast():
    cursor = g.conn.execute(text("select * from actor"))
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    return jsonify({'items': items, 'status': 'success'})


@app.route('/api/movies/genre/<int:genre_id>', methods=['GET'])
def get_movie_by_genre(genre_id):
    cursor = g.conn.execute(
        text("select v.video_id, v.name, v.description, v.duration, v.video_link, avg(re.rating) as rating "
             "from linked_to l "
             "inner join video_item_belongsto v on v.video_id = l.video_id "
             "left join rates r on r.video_id = v.video_id "
             "left join review re on re.review_id = r.review_id "
             "where genre_id = :genre_id "
             "group by v.video_id, re.rating, v.name, v.description, v.duration, v.video_link "
             "order by avg(re.rating) desc NULLS last"),
        {'genre_id': genre_id})
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    logging.debug(items)
    return jsonify({'items': items, 'status': 'success'})


@app.route('/api/movies/cast/<int:actor_id>', methods=['GET'])
def get_movie_by_actor(actor_id):
    cursor = g.conn.execute(text("select * from actor a inner join starred_by s on a.actor_id = s.actor_id inner join "
                                 "video_item_belongsto v on v.video_id = "
                                 "s.video_id where s.actor_id = :actor_id"),
                            {'actor_id': actor_id})
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    return jsonify({'items': items, 'status': 'success'})


@app.route('/api/trending', methods=['GET'])
def get_trending():
    cursor = g.conn.execute(text("select v.video_id, v.name, v.description, v.duration, v.video_link, v.category_id, "
                                 "AVG(rev.rating) as rating from rates r inner join review rev on r.review_id = "
                                 "rev.review_id "
                                 "inner join video_item_belongsto v on r.video_id = v.video_id group by v.video_id, "
                                 "v.name, v.description, v.duration, v.video_link, v.category_id order by rating desc "
                                 "limit 10"))
    result = cursor.fetchall()
    cursor.close()
    items = [dict(row) for row in result]
    return jsonify({'items': items, 'status': 'success'})


@app.route('/api/recently-watched', methods=['GET'])
def get_recently_viewed():
    logging.debug(session.get('user_id'))
    cursor = g.conn.execute(text("SELECT ui.user_id, ui.name as username, v.video_id, v.name,v.description, "
                                 "v.duration,v.video_link, "
                                 "vw.timestamp FROM "
                                 "USER_INFORMATION ui "
                                 "INNER JOIN VIEWED vw ON ui.user_id = vw.user_id INNER JOIN VIDEO_ITEM_BELONGSTO v "
                                 "ON vw.video_id = v.video_id "
                                 "WHERE vw.completed = 0::BIT and ui.user_id = :user_id ORDER BY vw.timestamp DESC "
                                 "LIMIT 10;"), {'user_id': session.get('user_id')})
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    return jsonify({'items': items, 'status': 'success'})


@app.route('/api/reviews/<int:video_id>', methods=['GET'])
def get_reviews(video_id):
    cursor = g.conn.execute(text("select * from rates r inner join review re on re.review_id=r.review_id where "
                                 "r.video_id = :video_id"),
                            {'video_id': video_id})
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    return jsonify({'items': items, 'status': 'success'})


@app.route('/api/write-reviews', methods=['POST'])
def write_review():
    payload = request.get_json()
    video_id = payload.get('video_id')
    comment_string = payload.get('comment_string')
    rating = payload.get('rating')

    res = g.conn.execute(text("select * from rates where video_id = :video_id and user_id = :user_id"),
                         {'video_id': video_id, 'user_id': session.get('user_id')})

    if res.rowcount == 0:
        result = g.conn.execute(text("insert into review(comment_string,rating, likes) values(:comment_string,"
                                     ":rating, 0::BIT) RETURNING review_id"),
                                {'comment_string': comment_string, 'rating': rating})
        g.conn.commit()
        review_id = result.fetchone()[0]
        g.conn.execute(text("insert into rates(video_id, user_id, review_id) values(:video_id, :user_id, :review_id)"),
                       {'video_id': video_id, 'user_id': session.get('user_id'), 'review_id': review_id})
        g.conn.commit()
        return jsonify({'message': 'success', 'status': 200}), 200
    else:
        return jsonify({'message': 'Already reviewed for the video, cannot review again!', 'status': 400}), 400


@app.route('/api/viewing', methods=['POST'])
def get_update_viewed():
    payload = request.get_json()
    video_id = payload.get('videoId')

    g.conn.execute(text("insert into viewed(user_id,video_id,completed, timestamp) values(:user_id,:video_id, 0::BIT, "
                        "CURRENT_DATE) ON CONFLICT (user_id, video_id) DO UPDATE SET timestamp = CURRENT_DATE"),
                   {'video_id': video_id, 'user_id': session.get('user_id')})
    g.conn.commit()
    return jsonify({'message': 'success', 'status': 200}), 200


@app.route('/api/user-subscription', methods=['POST'])
def subscribeUser():
    payload = request.get_json()
    subtype = payload.get('type')
    price = payload.get('price')
    if subtype == "Annual":
        g.conn.execute(text("insert into annual_subscriber(user_id,annual_price,expiry, reward_points) values("
                            ":user_id,:price, NOW() + INTERVAL '365 days', 100)"),
                   {'price': price, 'user_id': session.get('user_id')})
        g.conn.commit()
    else:
        g.conn.execute(text("insert into monthly_subscriber(user_id,monthly_price,plan_expiry) values("
                            ":user_id,:price, NOW() + INTERVAL '30 days')"),
                       {'price': price, 'user_id': session.get('user_id')})
        g.conn.commit()
    session['is_subscriber'] = 1
    return jsonify({'message': 'success', 'status': 200}), 200


@app.route('/api/profile', methods=['GET'])
def get_profile_information():
    cursor = g.conn.execute(text("select * from user_information u left join annual_subscriber a on a.user_id = "
                                 "u.user_id "
                                 "left join monthly_subscriber m on m.user_id = u.user_id left join pays p on "
                                 "p.user_id = u.user_id where "
                                 "u.user_id = :user_id"),
                            {'user_id': session.get('user_id')})
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    return jsonify({'items': items, 'status': 'success'})


@app.route('/api/cards', methods=['GET'])
def get_cards():
    cursor = g.conn.execute(text("select * from payment_information pi inner join pays p on p.card_number = "
                                 "pi.card_number where p.user_id = :user_id"),
                            {'user_id': session.get('user_id')})
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    return jsonify({'items': items, 'status': 'success'})


@app.route('/api/subscription', methods=['GET'])
def perform_subscription_query():
    cursor = g.conn.execute(
        text("SELECT UI.user_id, UI.name AS username, MS.plan_expiry, ASB.expiry,CASE WHEN MS.plan_expiry >= "
             "CURRENT_DATE or ASB.expiry >= CURRENT_DATE THEN 'Active' ELSE 'Inactive' "
             "END as plan_status,CASE WHEN COALESCE(MS.plan_expiry, '1970-01-01') < CURRENT_DATE and COALESCE("
             "ASB.expiry, '1970-01-01') < CURRENT_DATE THEN "
             "CASE WHEN PI.autopay = 1::BIT THEN 'Auto debited from Card' ELSE 'Payment Due (Autopay Disabled)' END "
             "ELSE 'Paid' END AS payment_status, COALESCE(ASB.annual_price, MS.monthly_price) AS subscription_price, "
             "CASE WHEN MS.plan_expiry >= CURRENT_DATE AND PI.autopay = 1::BIT THEN 0 "
             "WHEN MS.plan_expiry >= CURRENT_DATE THEN MS.monthly_price WHEN ASB.expiry >= CURRENT_DATE AND "
             "PI.autopay = 1::BIT AND ASB.reward_points >= ASB.annual_price THEN 0 "
             "WHEN ASB.expiry >= CURRENT_DATE THEN ASB.annual_price - ASB.reward_points ELSE 0 END AS payment_due,"
             "CASE WHEN ASB.expiry >= CURRENT_DATE THEN ASB.expiry - INTERVAL '365 days' "
             "WHEN MS.plan_expiry >= CURRENT_DATE THEN MS.plan_expiry - INTERVAL '30 days' ELSE NULL "
             "END AS since_date, CASE WHEN ASB.expiry >= CURRENT_DATE THEN ASB.expiry "
             "WHEN MS.plan_expiry >= CURRENT_DATE THEN MS.plan_expiry ELSE NULL END AS end_date,pay.card_number as "
             "card, case when ASB.expiry is not null then 'Annual "
             "Subscriber' "
             "when MS.plan_expiry is not null then 'Monthly Subscriber' else 'No Subscription' end as subscriber FROM "
             "USER_INFORMATION UI LEFT JOIN MONTHLY_SUBSCRIBER "
             "MS ON UI.user_id = "
             "MS.user_id "
             "LEFT JOIN ANNUAL_SUBSCRIBER ASB ON UI.user_id = ASB.user_id "
             "INNER JOIN PAYS pay ON pay.user_id = UI.user_id INNER JOIN PAYMENT_INFORMATION PI ON PI.card_number = "
             "pay.card_number "
             "where UI.user_id = :user_id LIMIT 1"
             ), {'user_id': session.get('user_id')}
    )
    result = cursor.fetchall()
    cursor.close()
    items = [dict(row) for row in result]

    return jsonify({'items': items, 'status': 'success'})


@app.route('/api/user-reviews', methods=['GET'])
def get_user_reviews():
    cursor = g.conn.execute(text("select * from rates r inner join review re on re.review_id = r.review_id inner join "
                                 "user_information u on u.user_id = r.user_id "
                                 "inner join video_item_belongsto v on v.video_id = r.video_id where u.user_id = "
                                 ":user_id"),
                            {'user_id': session.get('user_id')})
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    return jsonify({'items': items, 'status': 'success'})


@app.route('/api/favourites', methods=['GET'])
def get_favourites():
    cursor = g.conn.execute(text("select * from rates r inner join review re on re.review_id = r.review_id inner join "
                                 "user_information u on u.user_id = r.user_id "
                                 "inner join video_item_belongsto v on v.video_id = r.video_id where u.user_id = "
                                 ":user_id and re.likes = 1::BIT"),
                            {'user_id': session.get('user_id')})
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    return jsonify({'items': items, 'status': 'success'})


@app.route('/api/new-card', methods=['POST'])
def add_new_card():
    payload = request.get_json()
    cardName = payload.get('cardName')
    cardType = payload.get('cardType')
    cardNumber = payload.get('cardNumber')
    expiryDate = payload.get('expiryDate')
    autopay = payload.get('autopay')

    res = g.conn.execute(text("select * from payment_information where card_number = :card_number"),
                         {'card_number': cardNumber})

    if res.rowcount == 0:
        g.conn.execute(text("insert into payment_information values(:card_number, :name, :card_type, :expiry, "
                            ":autopay)"),
                       {'card_number': cardNumber, 'name': cardName, 'card_type': cardType, 'expiry': expiryDate,
                        'autopay': autopay})
        g.conn.commit()

    g.conn.execute(text("insert into pays values(:card_number, :user_id, CURRENT_DATE)"),
                   {'card_number': cardNumber, 'user_id': session.get('user_id')})
    g.conn.commit()
    return jsonify({'message': 'success', 'status': 200}), 200


@app.route('/api/cards/<card_number>', methods=['DELETE'])
def delete_card(card_number):
    g.conn.execute(text("DELETE FROM pays WHERE card_number = :card_number and user_id= :user_id"),
                   {'card_number': card_number, 'user_id': session.get('user_id')})
    g.conn.commit()
    return jsonify({'message': 'success', 'status': 200}), 200


@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    cursor = g.conn.execute(text("select video.name, video.description, video.duration, video.video_link,"
                                 "video.video_id, rev.rating from video_item_belongsto video "
                                 "inner join linked_to linked on linked.video_id = video.video_id "
                                 "inner join starred_by star on star.video_id = video.video_id "
                                 "inner join rates rate on rate.video_id = video.video_id "
                                 "inner join review rev on rev.review_id = rate.review_id "
                                 "where category_id in (select distinct category_id from rates r inner join review re "
                                 "on re.review_id = r.review_id inner join "
                                 "user_information u on u.user_id = r.user_id "
                                 "inner join video_item_belongsto v on v.video_id = r.video_id "
                                 "where u.user_id = :user_id and re.likes = 1::BIT) or linked.genre_id in (select "
                                 "distinct genre_id from rates r inner join review re on re.review_id = r.review_id "
                                 "inner join "
                                 " user_information u on u.user_id = r.user_id "
                                 "inner join video_item_belongsto v on v.video_id = r.video_id "
                                 "inner join linked_to l on l.video_id = v.video_id "
                                 "where u.user_id = :user_id and re.likes = 1::BIT) or star.actor_id in (select "
                                 "distinct actor_id from rates r inner join review re on re.review_id = r.review_id "
                                 "inner join "
                                 "user_information u on u.user_id = r.user_id "
                                 "inner join video_item_belongsto v on v.video_id = r.video_id "
                                 "inner join starred_by s on s.video_id = v.video_id "
                                 "where u.user_id = :user_id and re.likes = 1::BIT) "
                                 "group by rev.rating, video.name, video.description, video.duration, "
                                 "video.video_link,video.video_id "
                                 "having avg(rev.rating) > 9 "
                                 "limit 10"), {'user_id': session.get('user_id')})
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    return jsonify({'items': items, 'status': 'success'})


if __name__ == "__main__":
    import click


    @click.command()
    @click.option('--debug', is_flag=True)
    @click.option('--threaded', is_flag=True)
    @click.argument('HOST', default='0.0.0.0')
    @click.argument('PORT', default=8111, type=int)
    def run(debug, threaded, host, port):
        """
    This function handles command line parameters.
    Run the server using:

        python3 server.py

    Show the help text using:

        python3 server.py --help

    """

        HOST, PORT = host, port
        print("running on %s:%d" % (HOST, PORT))
        app.run(host=HOST, port=PORT, debug=debug, threaded=threaded)


    run()
