const Robot = require('../../models/robot.js');

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function generateSerial(length) {
    let serial = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i=0; i<length; i++) {
        serial += characters.charAt(getRandomNumber(0, characters.length));
    }
    return serial;
};
const capabilities = ['hospitality', 'errands', 'security', 'maintenance', 'strength', 'psychology', 'entertainment'];
const statuses = ['ready', 'busy', 'charging','maintenance'];

const manufacturers = ['Boston Dynamics', 'Hahne-Kedar', 'iRobot', 'NovaGen', 'Seraph AI', 'Toyota'];
const models = ['Atlas V', 'Tempest', 'LifeMate', 'NGX-2000', 'Aegis VII', 'HSR-3']
const model_capabilites = [
    ['maintenance', 'strength', 'entertainment'],
    ['security', 'maintenance', 'strength'],
    ['hospitality', 'errands', 'psychology'],
    ['security', 'maintenance', 'errands'],
    ['hospitality', 'errands', 'security', 'strength', 'psychology', 'entertainment'],
    ['hospitality', 'psychology', 'entertainment']
];

const model_prices = [49.99, 74.99, 19.99, 59.99, 119.99, 29.99];

const warehouses = [
    [49.25149688570242,-122.91704280941264],
    [49.26024700123663, -122.99920912509725],
    [49.19301449293186, -123.12171532146394],
    [49.27864218692201, -123.10969745932363],
    [49.138205347506364, -122.847054123359],
    [49.120129818190215, -122.65588882015476],
    [49.184637464315685, -122.6570607785934],
    [49.25562943766149, -122.74470451395477]
];

function generateRobot() {
    let type = getRandomNumber(0, 5);
    let location = getRandomNumber(0, 7);
    let newRobot = new Robot({
        manufacturer: manufacturers[type],
        model: models[type],
        price: model_prices[type],
        serial: generateSerial(25),
        capabilities: model_capabilites[type],
        operatingTime: 0,
        battery: 100,
        status: 'ready',
        location: {latitude: warehouses[location][0], longitude: warehouses[location][1]}
    });
    return newRobot
};

async function create(number) {
    for (let i = 0; i < number; i++) {
        let robot = generateRobot();
        await robot.save();
    }
};