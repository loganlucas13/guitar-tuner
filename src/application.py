from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import detection

# create flask app
app = Flask(__name__, static_folder='static')

# create socket for client-server connection
socketio = SocketIO(app);

# clears cache each page load
@app.before_request
def clearCache():
    app.jinja_env.cache = {}

# opens 'page.html' on load, which holds all functionality for the website
@app.route('/')
def home():
    return render_template("page.html")

# each time an audio chunk is received, run calculations
@socketio.on('audioChunk')
def processAudioChunk(packet):
    closestNote = detection.analyzeData(packet)
    emit('AUDIO PROCESSED', closestNote)

if __name__ == '__main__':
    # listens on all network interfaces
    socketio.run(app, host = '0.0.0.0', port=8080, debug=True)