const network = require('net');

const customer = new network.Socket();
const MINIMUM_RANGE = process.argv[2] || 1;
const MAXIMUM_RANGE = process.argv[3] || 100;

const correctAnswer = Math.floor(Math.random() * (MAXIMUM_RANGE - MINIMUM_RANGE) + MINIMUM_RANGE);

console.log(`Correct Answer is ${correctAnswer}`);

customer.connect(3000, 'localhost', () => {
  console.log(`Connected to server. Range: ${MINIMUM_RANGE}-${MAXIMUM_RANGE}`);
  customer.write(JSON.stringify({ range: `${MINIMUM_RANGE}-${MAXIMUM_RANGE}` }));
});

customer.on('data', (data) => {
  const message = JSON.parse(data);

  if (message.answer) {
    console.log(`Server says: ${message.answer}`);

    if (message.answer !== correctAnswer) {
      customer.write(JSON.stringify({ hint: message.answer < correctAnswer ? 'more' : 'less' }));
    } else {
      console.log('User guessed correctly');
      customer.destroy();
    }
  }
});

customer.on('close', () => {
  console.log('Connection closed');
});
