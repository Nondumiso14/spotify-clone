import sqlite3

conn = sqlite3.connect("spotify.db")
conn.execute("DELETE FROM songs")
conn.commit()
conn.close()
print("Songs cleared!")