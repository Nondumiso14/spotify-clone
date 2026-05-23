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
        "SELECT id, password, display_name, role FROM users WHERE email = ?", (email,)
    )
    user = cursor.fetchone()
    conn.close()

    if user and bcrypt.checkpw(password.encode("utf-8"), user[1]):
        session["user_id"] = user[0]
        return jsonify({
            "message": "Login successful",
            "user_id": user[0],
            "display_name": user[2],
            "email": email,
            "role": user[3]
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
        {
            "id": s[0],
            "title": s[1],
            "artist": s[2],
            "file_path": s[3],
            "genre": s[4] if len(s) > 4 else "Unknown"
        }
        for s in songs
    ])


# ── Search songs ──────────────────────────────────────────
@app.route("/search", methods=["GET"])
def search_songs():
    query = request.args.get("q", "")
    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM songs WHERE title LIKE ? OR artist LIKE ? OR genre LIKE ?",
        (f"%{query}%", f"%{query}%", f"%{query}%")
    )
    songs = cursor.fetchall()
    conn.close()

    return jsonify([
        {
            "id": s[0],
            "title": s[1],
            "artist": s[2],
            "file_path": s[3],
            "genre": s[4] if len(s) > 4 else "Unknown"
        }
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
        SELECT songs.id, songs.title, songs.artist, songs.file_path, songs.genre
        FROM favorites
        JOIN songs ON favorites.song_id = songs.id
        WHERE favorites.user_id = ?
    """, (user_id,))
    songs = cursor.fetchall()
    conn.close()

    return jsonify([
        {
            "id": s[0],
            "title": s[1],
            "artist": s[2],
            "file_path": s[3],
            "genre": s[4] if len(s) > 4 else "Unknown"
        }
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
        "SELECT id, email, display_name, role FROM users WHERE id = ?", (user_id,)
    )
    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({
            "id": user[0],
            "email": user[1],
            "display_name": user[2],
            "role": user[3]
        })
    return jsonify({"message": "User not found"}), 404


# ── Create a playlist ─────────────────────────────────────
@app.route("/playlists", methods=["POST"])
def create_playlist():
    data = request.get_json()
    user_id = data.get("user_id")
    name = data.get("name")

    if not user_id or not name:
        return jsonify({"message": "user_id and name required"}), 400

    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO playlists (user_id, name) VALUES (?, ?)",
        (user_id, name)
    )
    conn.commit()
    playlist_id = cursor.lastrowid
    conn.close()

    return jsonify({"message": "Playlist created", "id": playlist_id})


# ── Get user's playlists ──────────────────────────────────
@app.route("/playlists/<int:user_id>", methods=["GET"])
def get_playlists(user_id):
    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, name FROM playlists WHERE user_id = ?", (user_id,)
    )
    playlists = cursor.fetchall()
    conn.close()

    return jsonify([
        {"id": p[0], "name": p[1]}
        for p in playlists
    ])


# ── Add song to playlist ──────────────────────────────────
@app.route("/playlists/add-song", methods=["POST"])
def add_song_to_playlist():
    data = request.get_json()
    playlist_id = data.get("playlist_id")
    song_id = data.get("song_id")

    if not playlist_id or not song_id:
        return jsonify({"message": "playlist_id and song_id required"}), 400

    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)",
            (playlist_id, song_id)
        )
        conn.commit()
        return jsonify({"message": "Song added to playlist"})
    except sqlite3.IntegrityError:
        return jsonify({"message": "Song already in playlist"}), 400
    finally:
        conn.close()


# ── Get songs in a playlist ───────────────────────────────
@app.route("/playlists/<int:playlist_id>/songs", methods=["GET"])
def get_playlist_songs(playlist_id):
    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    cursor.execute("""
        SELECT songs.id, songs.title, songs.artist, songs.file_path, songs.genre
        FROM playlist_songs
        JOIN songs ON playlist_songs.song_id = songs.id
        WHERE playlist_songs.playlist_id = ?
    """, (playlist_id,))
    songs = cursor.fetchall()
    conn.close()

    return jsonify([
        {
            "id": s[0],
            "title": s[1],
            "artist": s[2],
            "file_path": s[3],
            "genre": s[4] if len(s) > 4 else "Unknown"
        }
        for s in songs
    ])


# ── Delete a playlist ─────────────────────────────────────
@app.route("/playlists/<int:playlist_id>", methods=["DELETE"])
def delete_playlist(playlist_id):
    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM playlist_songs WHERE playlist_id = ?", (playlist_id,))
    cursor.execute("DELETE FROM playlists WHERE id = ?", (playlist_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Playlist deleted"})


# ── Remove song from playlist ─────────────────────────────
@app.route("/playlists/remove-song", methods=["DELETE"])
def remove_song_from_playlist():
    data = request.get_json()
    playlist_id = data.get("playlist_id")
    song_id = data.get("song_id")

    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?",
        (playlist_id, song_id)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Song removed from playlist"})


# ── Get all users (admin) ─────────────────────────────────
@app.route("/admin/users", methods=["GET"])
def get_all_users():
    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, display_name, role FROM users")
    users = cursor.fetchall()
    conn.close()

    return jsonify([
        {
            "id": u[0],
            "email": u[1],
            "display_name": u[2],
            "role": u[3]
        }
        for u in users
    ])


# ── Delete a user (admin) ─────────────────────────────────
@app.route("/admin/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "User deleted"})


# ── Add a song (admin) ────────────────────────────────────
@app.route("/admin/songs", methods=["POST"])
def add_song():
    data = request.get_json()
    title = data.get("title")
    artist = data.get("artist")
    file_path = data.get("file_path")
    genre = data.get("genre", "Unknown")

    if not title or not artist or not file_path:
        return jsonify({"message": "title, artist and file_path required"}), 400

    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO songs (title, artist, file_path, genre) VALUES (?, ?, ?, ?)",
        (title, artist, file_path, genre)
    )
    conn.commit()
    song_id = cursor.lastrowid
    conn.close()

    return jsonify({"message": "Song added", "id": song_id})


# ── Delete a song (admin) ─────────────────────────────────
@app.route("/admin/songs/<int:song_id>", methods=["DELETE"])
def delete_song(song_id):
    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM songs WHERE id = ?", (song_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Song deleted"})


# ── Get dashboard stats (admin) ───────────────────────────
@app.route("/admin/stats", methods=["GET"])
def get_stats():
    conn = sqlite3.connect("spotify.db")
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM users")
    total_users = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM songs")
    total_songs = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM favorites")
    total_favorites = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM playlists")
    total_playlists = cursor.fetchone()[0]

    conn.close()

    return jsonify({
        "total_users": total_users,
        "total_songs": total_songs,
        "total_favorites": total_favorites,
        "total_playlists": total_playlists,
    })


# ── Run server ────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True)