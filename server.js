const net = require('net');
const fs = require('fs');

let users = [];
let userNames = [];
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

    client.write(`Welcome to the chat room, ${client.name}! type \'quit\' to exit.`);
    userNames.push(client.name);

    messages += (`${client.name} has joined the chat\n`)
    writeToMessageLog();
    users.forEach(user => {
        if (user !== client) {
            user.write(`${client.name} has joined the chat`);
        }
    });

    client.on('data', (data, err) => {
        data = data.toString().trim();
        if (err) throw err;
        if (data === 'quit') {
            users.forEach(user => {
                user.write(`${client.name} has left the chat.`);
                users = users.filter(user => {
                    user.name !== client.name;
                })
            });
            client.write('you have left the chat')
            messages += (`${client.name} has left the chat\n`);
            writeToMessageLog();

        } else if (data.includes('/w')) {
            let newData = data.split(' ');
            let selectedUser = newData[1];
            let message = newData.slice(2).join(' ');
            if (selectedUser === client.name || userNames.includes(selectedUser) === false) {
                client.write('command error');
            } else {
                users.forEach(user => {
                    if (user.name === selectedUser) {
                        user.write(`(only you can see this message) ${client.name}: ${message}`);
                    }
                });
                messages += (`${client.name} whispered to ${selectedUser}: ${message}`);
                writeToMessageLog();
            }

        } else if (data.includes('/username')) {
            let newData = data.split(' ');
            let newName = newData[1];
            let index = userNames.indexOf(client.name);
            if (index !== -1) {
                userNames[index] = newName;
            }
            messages += (`${client.name} is now ${newName}`);
            writeToMessageLog();
            users.forEach(user => {
                if (user !== client) {
                    user.write(`${client.name} is now ${newName}`);
                }
            });
            client.write(`you are now ${newName}`);
            client.name = newName;

        } else if (data.includes('/kick')) {
            let newData = data.split(' ');
            let selectedUser = newData[1];
            if ((selectedUser === client.name) || (userNames.includes(selectedUser) === false)) {
                client.write('command error')
            } else {
                users.forEach(user => {
                    user.write(`${selectedUser} has been kicked by ${client.name}`);
                });
                users = users.filter(user => {
                    console.log(users.length)
                    user.name !== selectedUser;
                });
                users.forEach(user => console.log('users: ' + user.name))
                console.log(users.length);
                messages += (`${selectedUser} has been kicked by ${client.name}`);
                writeToMessageLog();
            }

        } else if (data === '/clientlist') {
            userNames.forEach(user => client.write(user));
            messages += (`${client.name} has used the command /clientlist`);
            writeToMessageLog()
        } else {
            users.forEach(user => {
                if (user !== client) {
                    user.write(`${client.name}: ${data}`);
                    messages += (`${client.name}: ${data}\n`);
                    writeToMessageLog();
                }
            })
        };
    })

}).listen(5000);

console.log('Listening on port 5000');