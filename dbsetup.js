const sqlite3 = require ('sqlite3').verbose()
let db = new sqlite3.Database('./db/user.db');
db.run('CREATE TABLE users(id INTEGER PRIMARY KEY AUTOINCREMENT, first, last, email, password)');
db.close();