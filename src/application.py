from flask import Flask, render_template

# create flask app
app = Flask(__name__, static_folder='static')


# clears cache each page load
@app.before_request
def clearCache():
    app.jinja_env.cache = {}

# opens 'page.html' on load, which holds all functionality for the website
@app.route('/')
def home():
    return render_template("page.html")


if __name__ == '__main__':
    # listens on all network interfaces
    app.run(host='0.0.0.0', port=8080, debug=True)