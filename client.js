const net = require('net');

let client = net.createConnection({ port: 5000 }, () => {
    console.log('Connected');
});

client.setEncoding('utf8');
client.on('data', message => {
    console.log(message);
});

process.stdin.setEncoding('utf8');
process.stdin.on('data', (data) => {
    client.write(data);
});