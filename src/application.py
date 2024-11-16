from flask import Flask, render_template
import os # for directory moving

# global variables

# create flask app
app = Flask(__name__, static_folder='static')


# opens 'page.html' on load
@app.route('/')
def home():
    return render_template("page.html")


if __name__ == '__main__':
    # listens on all network interfaces
    app.run(host='0.0.0.0', port=5000, debug=True)