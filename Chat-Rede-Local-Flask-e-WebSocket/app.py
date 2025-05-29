import eventlet

eventlet.monkey_patch()

from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_socketio import SocketIO, emit
import os
import uuid

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'static', 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
socketio = SocketIO(app, async_mode='eventlet')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload_avatar', methods=['POST'])
def upload_avatar():
    username = request.form.get('username', '')
    file = request.files.get('avatar')
    if not file or not username:
        return jsonify({'success': False}), 400
    ext = os.path.splitext(file.filename)[1].lower()
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    avatar_url = f"/static/uploads/{filename}"
    user_id = uuid.uuid4().hex
    return jsonify({'success': True, 'avatar_url': avatar_url, 'user_id': user_id})

@socketio.on('message')
def handle_message(msg):
    if isinstance(msg, dict) and 'user' in msg and 'text' in msg:
        emit('message', msg, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8000)
