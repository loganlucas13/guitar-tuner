from flask import Flask, render_template

# create flask app
app = Flask(__name__, static_folder='static')


# opens 'page.html' on load
@app.route('/')
def home():
    return render_template("page.html")


if __name__ == '__main__':
    # listens on all network interfaces
    app.run(host='0.0.0.0', port=8080, debug=True)