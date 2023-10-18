const mysql = require('mysql');

const dbConnection = mysql.createConnection({
    host:"",
    user:"",
    password:"",
    database:"",
});

dbConnection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL database connected!');
})

module.exports = dbConnection;