const net = require('net');
const fs = require('fs');

let users = [];
let messages = 'Message Log \n\n';
let guestNumber = 1;


let server = net.createServer(client => {
    client.name = `guest${guestNumber}`;
    users.push(client);
    console.log(client.name)
    guestNumber++;

    function writeToMessageLog() {
        fs.writeFile('./messageLog.txt', messages, err => {
            if (err) throw err;
        })
    }

    client.write('Welcome to the chat room! type \'quit\' to exit.');

    messages += (`${client.name} has joined the chat\n`)
    writeToMessageLog();
    users.forEach(user => {
        if (user !== client) {
            user.write(`${client.name} has joined the chat`);
        }
    });

    client.on('data', (data) => {
        data = data.toString().trim();
        if (data === 'quit') {
            users.forEach(user => {
                user.write(`${client.name} has left the chat.`);
                users = users.filter(user => {
                    user.name != client.name;
                })
            });
            client.write('you have left the chat')
            messages += (`${client.name} has left the chat\n`);
            writeToMessageLog()
            //terminate code here
        } else {
            users.forEach(user => {
                if (user !== client) {
                    user.write(`${client.name}: ${data}`);
                    messages += (`${client.name}: ${data}\n`);
                    console.log(messages);
                    writeToMessageLog();
                }
            })
        };
    })

}).listen(5000);

console.log('Listening on port 5000');