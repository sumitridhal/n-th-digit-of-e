//
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function factorial(x) {
  if (x == 0) {
    return 1;
  }
  return x * factorial(x - 1);
}

function calcE(n) {
  let euler, itr;
  euler = 0
  itr = Number(n)
    for (var i = 0; i < itr+1; i++) {
      let fact = factorial(i)
      euler += 1/fact
      //console.log(`factorial of ${i}: ${1/fact}`)
    }
  return euler;
}

rl.question('Enter n value: ', (n) => {
  let e = calcE(n)
  console.log(`E: ${e}`)
  rl.close()
});
