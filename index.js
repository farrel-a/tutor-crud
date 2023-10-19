// Patient CRUD REST API + IoT using MQTT
const express = require('express');
const bodyParser = require('body-parser');
const dbConnection = require('./config/database');
const mqttClient = require('./config/mqtt');

// --- REST API HTTP Server ---
const app = express();
const PORT = process.env.PORT || 5000;
// parse JSON
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// root route
app.get('/', (req, res) => {
    res.send('Patient API');
});

// create patient
app.post('/api/patient', (req, res) => {
    const data = {...req.body};
    const querySql = 'INSERT INTO patient SET ?';

    dbConnection.query(querySql, data, (err, rows, field) => {
        if (err) {
            res.status(500).json({success: false, message: 'Failed to insert data'});
        }

        res.status(201).json({success: true, message: 'Data inserted successfully'});
    });
});

// read all patients data
app.get('/api/patient', (req, res) => {
    const querySql = 'SELECT * FROM patient';

    dbConnection.query(querySql, (err, rows, field) => {
        if (err) {
            res.status(500).json({success: false, message: 'Failed to get all patients data'});
        }
        res.status(201).json({success: true, data: rows});
    })
})

// read one patient data
app.get('/api/patient/:id', (req, res) => {
    const id = req.params.id;
    const querySql = 'SELECT * FROM patient WHERE id = ?';
    dbConnection.query(querySql, id, (err, rows, field) => {
        if (err) {
            res.status(500).json({success: false, message: 'Failed to get patient data'});
        }
        if (rows.length) {
            res.status(200).json({success: true, data: rows});
        }
        else {
            return res.status(404).json({success: false, message: 'Patient not found'})
        }
    })
})

// update patient data
app.put('/api/patient/:id', (req, res) => {
    const data = {...req.body};
    const id = req.params.id;
    // query to search existence of patient id
    const querySearch = `SELECT * FROM patient WHERE id = ?`;

    // query to update patient data
    const queryUpdate = `UPDATE patient SET ? WHERE id = ?`;
    dbConnection.query(querySearch, id, (err, rows, field) => {
        if (err) {
            res.status(500).json({success: false, message: 'Internal server error'});
        }

        if (rows.length) {
            dbConnection.query(queryUpdate, [data,id], (err, rows, field) => {
                if (err) {
                    res.status(500).json({success: false, message: 'Failed to update data'});
                }
                res.status(200).json({success: true, message: 'Data updated successfully'});
            });
        }
        else {
            return res.status(404).json({success: false, message: 'Patient not found'})
        }
    });
});

// delete patient data
app.delete('/api/patient/:id', (req, res) => {
    const id = req.params.id;
    // query to search existence of patient id
    const querySearch = `SELECT * FROM patient WHERE id = ?`;

    // query to delete patient data
    const queryDelete = `DELETE FROM patient WHERE id = ?`;

    dbConnection.query(querySearch, id, (err, rows, field) => {
        if (err) {
            res.status(500).json({success: false, message: 'Internal server error'});
        }

        if (rows.length) {
            dbConnection.query(queryDelete, id, (err, rows, field) => {
                if (err) {
                    res.status(500).json({success: false, message: 'Failed to delete data'});
                }
                res.status(200).json({success: true, message: 'Patient deleted successfully'});
            });
        }
        else {
            return res.status(404).json({success: false, message: 'Patient not found'})
        }
    });
});

// Get all room1 status temperature
app.get('/api/room1', (req, res) => {
    const querySql = 'SELECT * FROM room1_status';
    dbConnection.query(querySql, (err, rows, field) => {
        if (err) {
            res.status(500).json({success: false, message: 'Failed to get room1 data'});
        }
        res.status(200).json({success: true, data: rows});
    })
})


app.listen(PORT, ()=> {console.log(`Server running at port: ${PORT}`)});


// --- MQTT Protocol ---
mqttClient.on('connect', () => {
    console.log('MQTT broker connected');
    mqttClient.subscribe('/room1/temperature');
});

mqttClient.on('message', (topic, message) => {
    if (topic === '/room1/temperature') {
        // if receives message from this topic, insert to db
        const room1_timestamp = new Date().toISOString();
        const temperature = parseFloat(message.toString());
        const querySql = 'INSERT INTO room1_status SET ?';
        const data = {room1_timestamp, temperature};
        dbConnection.query(querySql, data, (err, rows, field) => {
            if (err) {
                console.log('Failed to insert data');
            }
            else {
                console.log('Data inserted successfully');
            }
        });
    }
});