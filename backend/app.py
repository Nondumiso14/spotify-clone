from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sqlite3
import bcrypt

app = Flask(__name__)
app.secret_key = "spotify_secret_key_2026"
CORS(app, supports_credentials=True)

# ── Home ──────────────────────────────────────────────────
@app.route("/")
def home():
    return "Spotify Backend Running 🎵"


# ── Register ──────────────────────────────────────────────
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    display_name = data.get("display_name", email)

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (email, password, display_name) VALUES (?, ?, ?)",
            (email, hashed_password, display_name)
        )
        conn.commit()
        return jsonify({"message": "User registered successfully"})
    except sqlite3.IntegrityError:
        return jsonify({"message": "User already exists"}), 400
    finally:
        conn.close()


# ── Login ─────────────────────────────────────────────────
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, password, display_name FROM users WHERE email = ?", (email,)
    )
    user = cursor.fetchone()
    conn.close()

    if user and bcrypt.checkpw(password.encode("utf-8"), user[1]):
        session["user_id"] = user[0]
        return jsonify({
            "message": "Login successful",
            "user_id": user[0],
            "display_name": user[2],
            "email": email
        })

    return jsonify({"message": "Invalid email or password"}), 401


# ── Logout ────────────────────────────────────────────────
@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})


# ── Get all songs ─────────────────────────────────────────
@app.route("/songs", methods=["GET"])
def get_songs():
    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM songs")
    songs = cursor.fetchall()
    conn.close()

    return jsonify([
        {"id": s[0], "title": s[1], "artist": s[2], "file_path": s[3]}
        for s in songs
    ])


# ── Search songs ──────────────────────────────────────────
@app.route("/search", methods=["GET"])
def search_songs():
    query = request.args.get("q", "")
    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM songs WHERE title LIKE ? OR artist LIKE ?",
        (f"%{query}%", f"%{query}%")
    )
    songs = cursor.fetchall()
    conn.close()

    return jsonify([
        {"id": s[0], "title": s[1], "artist": s[2], "file_path": s[3]}
        for s in songs
    ])


# ── Like a song ───────────────────────────────────────────
@app.route("/favorites", methods=["POST"])
def add_favorite():
    data = request.get_json()
    user_id = data.get("user_id")
    song_id = data.get("song_id")

    if not user_id or not song_id:
        return jsonify({"message": "user_id and song_id required"}), 400

    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO favorites (user_id, song_id) VALUES (?, ?)",
            (user_id, song_id)
        )
        conn.commit()
        return jsonify({"message": "Added to favorites"})
    except sqlite3.IntegrityError:
        return jsonify({"message": "Already in favorites"}), 400
    finally:
        conn.close()


# ── Get user's favorites ──────────────────────────────────
@app.route("/favorites/<int:user_id>", methods=["GET"])
def get_favorites(user_id):
    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    cursor.execute("""
        SELECT songs.id, songs.title, songs.artist, songs.file_path
        FROM favorites
        JOIN songs ON favorites.song_id = songs.id
        WHERE favorites.user_id = ?
    """, (user_id,))
    songs = cursor.fetchall()
    conn.close()

    return jsonify([
        {"id": s[0], "title": s[1], "artist": s[2], "file_path": s[3]}
        for s in songs
    ])


# ── Remove favorite ───────────────────────────────────────
@app.route("/favorites", methods=["DELETE"])
def remove_favorite():
    data = request.get_json()
    user_id = data.get("user_id")
    song_id = data.get("song_id")

    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM favorites WHERE user_id = ? AND song_id = ?",
        (user_id, song_id)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Removed from favorites"})


# ── Get user profile ──────────────────────────────────────
@app.route("/profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, email, display_name FROM users WHERE id = ?", (user_id,)
    )
    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({"id": user[0], "email": user[1], "display_name": user[2]})
    return jsonify({"message": "User not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)