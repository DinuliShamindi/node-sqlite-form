const sqlite3 = require ('sqlite3').verbose()
let db = new sqlite3.Database('./db/user.db');
module.exports = db;

