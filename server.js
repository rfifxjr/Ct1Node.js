const communicationModule = require('net');

const gameServer = communicationModule.createServer((socket) => {
  console.log('Match Begins!');

  let minimumRange, maximumRange;

  socket.on('data', (data) => {
    const message = JSON.parse(data);

    if (message.range) {
      console.log(`Match begins, range: ${message.range}`);
      const rangeParams = message.range.split("-");
      minimumRange = parseInt(rangeParams[0]);
      maximumRange = parseInt(rangeParams[1]);
      socket.write(JSON.stringify({ answer: Math.floor((minimumRange + maximumRange) / 2) }));
    }

    if (message.hint) {
      console.log(`Answer is ${message.hint}`);
      if (message.hint === "less") {
        maximumRange = Math.floor((minimumRange + maximumRange) / 2) - 1;
      }
      if (message.hint === "more") {
        minimumRange = Math.floor((minimumRange + maximumRange) / 2) + 1;
      }
      socket.write(JSON.stringify({ answer: Math.floor((minimumRange + maximumRange) / 2) }));
    }
  });

  socket.on('close', () => {
    console.log('Match ends!');
  });
});

const PORT_NUMBER = 3000;
gameServer.listen(PORT_NUMBER, () => {
  console.log(`Server listening on port ${PORT_NUMBER}`);
});
