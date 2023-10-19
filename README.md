# CRUD REST API for Bangkit Study Group
CRUD REST API for patient data + IoT room temperatue integration

## How to Run
1. Clone this repo
2. Fill database informations in `config/database.js`
3. Fill MQTT informations in `config/mqtt.js`
4. `npm i` to install depenedencies
5. `npm install -g pm2` to install process manager
6. `pm2 start index.js`