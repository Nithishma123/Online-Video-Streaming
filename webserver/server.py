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
from flask import Flask, request, render_template, g, redirect, Response, abort, jsonify
import logging

tmpl_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
app = Flask(__name__, template_folder=tmpl_dir, static_url_path='/static')

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
    cursor = g.conn.execute(text("select * from user_information where name= :username"), {'username': username})
    result = cursor.fetchall()
    cursor.close()
    if result:
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

    g.conn.execute(text("insert into user_information(name,email_id,phone_no,age,gender) values(:name,"
                        ":emailid, :phone, :age, :gender)"),
                   {'name': name, 'emailid': emailid, 'phone': phone, 'age': age,
                    'gender': gender})
    g.conn.commit()
    return jsonify({'message': 'Login successful', 'status': 200}), 200


@app.route('/home.html')
def home_screen():
    return render_template('home.html')


@app.route('/api/movies/<int:category_id>', methods=['GET'])
def get_all_movies(category_id):
    cursor = g.conn.execute(text("select * from video_item_belongsto where category_id=:category_id"),
                            {'category_id': category_id})
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    logging.debug(items)
    return jsonify({'items': items, 'status': 'success'})

@app.route('/api/categories', methods=['GET'])
def get_all_categories():
    cursor = g.conn.execute(text("select * from categories"))
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    logging.debug(items)
    return jsonify({'items': items, 'status': 'success'})

@app.route('/api/genres', methods=['GET'])
def get_all_genres():
    cursor = g.conn.execute(text("select * from genre"))
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    logging.debug(items)
    return jsonify({'items': items, 'status': 'success'})


@app.route('/api/cast', methods=['GET'])
def get_all_cast():
    cursor = g.conn.execute(text("select * from actor"))
    result = cursor.fetchall()
    items = [dict(row) for row in result]
    cursor.close()
    logging.debug(items)
    return jsonify({'items': items, 'status': 'success'})


@app.route('/api/movies/genre/<int:genre_id>', methods=['GET'])
def get_movie_by_genre(genre_id):
    cursor = g.conn.execute(text("select * from linked_to l inner join video_item_belongsto v on v.video_id = "
                                 "l.video_id where l.genre_id=:genre_id"),
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
    logging.debug(items)
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
    items = [dict(row) for row in result]
    cursor.close()
    logging.debug(items)
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
