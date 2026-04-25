from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import bcrypt

# Create app FIRST
app = Flask(__name__)
CORS(app)

# Home route
@app.route("/")
def home():
    return "Spotify Backend Running 🎵"


# 🔐 Register route (with password hashing)
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            (email, hashed_password)
        )
        conn.commit()
        return jsonify({"message": "User registered successfully"})

    except sqlite3.IntegrityError:
        return jsonify({"message": "User already exists"}), 400

    finally:
        conn.close()


# 🔐 Login route (with password verification)
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()

    # Get hashed password from DB
    cursor.execute(
        "SELECT password FROM users WHERE email = ?",
        (email,)
    )

    user = cursor.fetchone()
    conn.close()

    if user:
        stored_password = user[0]

        # Compare hashed password
        if bcrypt.checkpw(password.encode('utf-8'), stored_password):
            return jsonify({"message": "Login successful"})

    return jsonify({"message": "Invalid email or password"}), 401


# Run server LAST
if __name__ == "__main__":
    app.run(debug=True)