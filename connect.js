const mysql = require("mysql");

const mysqlConnection = mysql.createConnection({
	user: "julyTask", // replace with your username
	password: "123456", // replace with your password
	host: "localhost", // replace with localhost or 127.0.0.1
	database: "taskg2", // replace with your database name
});

module.exports = mysqlConnection;
