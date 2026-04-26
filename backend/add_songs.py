import sqlite3

conn = sqlite3.connect("spotify.db")
cursor = conn.cursor()

# Insert song 1
cursor.execute(
    "INSERT INTO songs (title, artist, file_path) VALUES (?, ?, ?)",
    ("Chill Beat", "Unknown", "/music/song1.mp3")
)

# Insert song 2
cursor.execute(
    "INSERT INTO songs (title, artist, file_path) VALUES (?, ?, ?)",
    ("Lofi Song", "DJ Test", "/music/song2.mp3")
)
# Insert song 2
cursor.execute(
    "INSERT INTO songs (title, artist, file_path) VALUES (?, ?, ?)",
    ("Lofi Song", "DJ Nondu", "/music/song3.mp3")
)
# Insert song 2
cursor.execute(
    "INSERT INTO songs (title, artist, file_path) VALUES (?, ?, ?)",
    ("Lofi Song", "DJ Blue", "/music/song4.mp3")
)



conn.commit()
conn.close()

print("Songs added successfully!")