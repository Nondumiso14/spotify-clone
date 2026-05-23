import sqlite3

conn = sqlite3.connect("spotify.db")
cursor = conn.cursor()

# Clear existing songs first to avoid duplicates
cursor.execute("DELETE FROM songs")

# Add songs with correct genres
cursor.execute("INSERT INTO songs (title, artist, file_path, genre) VALUES (?, ?, ?, ?)",
    ("Chill Beat", "Unknown", "/music/song1.mp3", "Chill"))

cursor.execute("INSERT INTO songs (title, artist, file_path, genre) VALUES (?, ?, ?, ?)",
    ("Lofi Song", "DJ Test", "/music/song2.mp3", "Lo-Fi"))

cursor.execute("INSERT INTO songs (title, artist, file_path, genre) VALUES (?, ?, ?, ?)",
    ("Lofi Song", "DJ Nondu", "/music/song3.mp3", "Lo-Fi"))

cursor.execute("INSERT INTO songs (title, artist, file_path, genre) VALUES (?, ?, ?, ?)",
    ("Lofi Song", "DJ Blue", "/music/song4.mp3", "Lo-Fi"))

conn.commit()
conn.close()
print("Songs added successfully!")