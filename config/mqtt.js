const mqtt = require('mqtt');
const ip_address = "";
const port = "";

const mqttClient = mqtt.connect(`mqtt://${ip_address}:${port}`)

module.exports = mqttClient;