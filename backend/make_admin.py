import sqlite3

conn = sqlite3.connect("spotify.db")
conn.execute("UPDATE users SET role = 'admin' WHERE email = 'nondu@gmail.com'")
conn.commit()
conn.close()
print("Done! User is now admin.")